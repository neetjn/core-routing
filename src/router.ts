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

// TODO: add documentation

class RouterTools implements IRouterTools {
  public config: IConfig;

  constructor (config: IConfig) {
    this.config = config;
  }

  @Memoize((route: string, source: string) => `${route}:${source}`)
  inspect (route: string, source: string): IRouterToolsResult {
    let parts = route.split('/');
    let query = '';
    let fragment = '';

    if (parts.length > 1) {
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

  @Memoize((route: string, source: string) => `${route}:${source}`)
  match (route: string, source: string): boolean {
    if (source !== this.config.settings.wildcard) {
      const result = this.inspect(route, source);

      if (result.route.length === result.source.length) {
        for (const i in result.source) {
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

  @Memoize((route: string, source: string) => `${route}:${source}`)
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
  public listenerKey?: number;
  public client?: IRouterClient;

  public $tools: IRouterTools;
  public $previous: IRouterLocation;

  constructor (args: IRouterArgs) {
    this.config = Object.assign(args.config || {}, Config);
    this.client = args.client;
    this.running = false;
    this.legacySupport = !('onpopstate' in window);
    this.$tools = new RouterTools(this.config);
    this.$previous = {
      path: '',
      hash: '',
      href: ''
    };
  }

  get $location () {
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

  watch () {
    if (this.running) {
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
        setInterval(this.watch.bind(this), this.config.intervals.listener);
      } else {
        window.addEventListener('popstate', this.watch.bind(this));
      }
    }
  }

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
