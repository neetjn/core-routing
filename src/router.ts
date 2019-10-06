import { Memoize } from 'typescript-memoize';
import {
  IObject,
  IRouterClient,
  IRouterToolsResult,
  IRouterToolsDetails,
  IRouterTools,
  IRouterArgs,
  IRouter
} from './interfaces/router';
import { IRouterLocation } from './interfaces/event';
import { IConfig } from './interfaces/config';
import { Config } from './config';
import { TypedEvent } from './interfaces/emitter';

// Provider for generating memoize cache keys for router tools.
// @param {string} route
// @param {string} source
// @returns {string}
const memoizeRTKey = (route: string, source: string): string => `${route}:${source}`;

class RouterTools implements IRouterTools {
  public config: IConfig;

  constructor (config: IConfig) {
    this.config = config;
  }

  /**
   * Provides basic information for both a route and source path.
   * @param {string} route - Route for inspection.
   * @param {string} source - Source path.
   * @returns {IRouterToolsResult}

    inspect('/user/1/profile?strict=true#header', '/user/:userId/profile') =>

      {
        route: ['user', '1', 'profile'],
        query: 'strict=true',
        fragment: 'header',
        source: ['user', ':userId', 'profile']
      }

   */
  @Memoize(memoizeRTKey)
  inspect (route: string, source: string): IRouterToolsResult {
    let parts;
    let query = '';
    let fragment = '';

    // skip computations on empty path
    if (route !== '/') {
      // split route path
      parts = route.split('/');
      // remove trailing from path
      const trailing = parts.slice(-1)[0];
      if (trailing.split('#').length > 1) {
        // provide fragment
        fragment = trailing.split('#')[1];
      }
      // provide query arguments
      if (trailing.indexOf('?') !== -1) {
        query = trailing.split('?')[1].split('#')[0];
      }
      // remove query arguments + fragment from route
      // remove expected empty first element
      parts = parts
        .join('/')
        .split('?')[0]
        .split('/')
        .slice(1);
    } else {
      // default to route "/"
      parts = ['/'];
    }

    return {
      route: parts,
      query,
      fragment,
      // split source path and remove expected empty first element
      source: source !== '/' ? source.split('/').slice(1) : [source]
    };
  }

  /**
   * Match a given route with a source path.
   * @param route - Route to match against source path.
   * @param source - Source path to match against route.
   * @returns {boolean}

    match('/user/search/groups', '/user/:userId/profile') => false
    match('/user/1/profile', '/user/:userId/profile') => true
    match('/some/route/yo', '*') => true

   */
  @Memoize(memoizeRTKey)
  match (route: string, source: string): boolean {
    // skip computation and match if path is wildcard
    if (source !== this.config.settings.wildcard) {
      const result = this.inspect(route, source);
      // don't even bother computations if length mismatch in path
      if (result.route.length === result.source.length) {
        for (const i in result.source) {
          // fail if not variable as denoted by source and chunk mismatch
          // result.source => ['user', ':userId', 'profile']
          // result.route => ['user', 'search', 'groups']
          // result.source[3] != result.route[3]
          if (
            !result.source[i].startsWith(':') &&
            result.route[i] !== result.source[i]
          ) {
            return false;
          }
        }
      } else {
        return false;
      }
    }

    return true;
  }

  /**
   * Provides detailed information for both a route and source path.
   * @param route - Route to process.
   * @param source - Source path to process.
   * @returns {boolean}

    process('/user/1/profile?strict=true#header', '/user/:userId/profile') =>

      {
        result: {
          route: ['user', '1', 'profile'],
          query: 'strict=true',
          fragment: 'header',
          source: ['user', ':userId', 'profile']
        },
        variables: {
          userId: 1
        }
        args: {
          strict: 'true'
        }
      }

   */
  @Memoize(memoizeRTKey)
  process (route: string, source: string): IRouterToolsDetails {
    const result = this.inspect(route, source);
    const variables: IObject = {};
    const args: IObject = {};

    result.source.forEach((part, i) => {
      if (part.startsWith(':')) {
        const name = part.slice(1);
        const value = result.route[i];
        variables[name] = value;
      }
    });

    if (result.query) {
      // deconstruct provided query string
      const query = result.query.split('&');
      query.forEach(arg => {
        const temp: Array<string> = arg.split('=');
        if (temp.length === 2) {
          // assign query string arguments
          args[temp[0]] = temp[1];
        }
      });
    }

    return {
      result,
      variables,
      args
    };
  }
}

class Router implements IRouter {
  public config: IConfig;
  public running: boolean;
  public legacySupport: boolean;
  public emitter: TypedEvent<any>;
  public listenerKey?: number;
  public client?: IRouterClient;

  public $tools: IRouterTools;
  public $previous: IRouterLocation;

  constructor (args: IRouterArgs) {
    this.emitter = new TypedEvent();
    this.config = Object.assign(args.config || {}, Config);
    this.client = args.client;
    this.running = false;
    // set to legacy mode if target HTML5 history api event not detected
    this.legacySupport = !('onpopstate' in window);
    this.$tools = new RouterTools(this.config);
    this.$previous = {
      path: '',
      hash: '',
      href: ''
    };
  }

  /**
   * Get detailed window location info.
   * @returns {IRouterLocation}
   */
  get $location (): IRouterLocation {
    let path = '';
    const hash = window.location.hash;
    if (hash.split(this.config.settings.hash).length > 1) {
      path = hash.split(this.config.settings.hash)[1];
      if (!path.startsWith('/')) {
        path = `/${path}`;
      }
    }
    return {
      path: path,
      hash: hash,
      href: window.location.href
    };
  }

  /** Subroutine for handling router navigation events */
  watch () {
    if (this.running) {
      // if legacy support detected and location unchanged between previous and current cycle
      // skip trigger for navigation event
      if (
        this.legacySupport &&
        JSON.stringify(this.$location) === JSON.stringify(this.$previous)
      ) {
        // bypass onNavigate trigger
        return;
      }
      if (this.client && this.client.onNavigate) {
        this.client.onNavigate({
          $tools: this.$tools,
          location: this.$location,
          previous: this.$previous
        });
      }
      this.$previous = this.$location;
    }
  }

  /** Start router listener on navigation events */
  start () {
    if (!this.running) {
      // toggle routing capabilities
      this.running = true;
      // initialize default previous location
      this.$previous = this.$location;
      if (this.client && this.client.onStart) {
        this.client.onStart({
          $tools: this.$tools,
          location: this.$location
        });
      }
      if (this.legacySupport) {
        // if legacy support is detected, set listener on interval
        setInterval(this.watch.bind(this), this.config.intervals.listener);
      } else {
        window.addEventListener('popstate', this.watch.bind(this));
      }
    }
  }

  /** Halt router listener on navigation events */
  stop () {
    if (this.running) {
      // toggle routing capabilities
      this.running = false;
      if (this.client && this.client.onStop) {
        this.client.onStop({
          $tools: this.$tools,
          location: this.$location
        });
      }
      if (this.legacySupport) {
        window.removeEventListener('popstate', this.watch);
      } else {
        window.clearInterval(this.listenerKey);
      }
    }
  }
}

module.exports = Router;
