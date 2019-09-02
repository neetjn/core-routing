import { IRouterClient, IRouterTools, IRouterToolsCache, IRouterArgs, IRouter } from './interfaces/router';
import { IRouterLocation } from './interfaces/event';
import { IConfig } from './interfaces/config';
import { Config } from './config';

// TODO: add documentation

// TODO: complete router tools and implement in router
class RouterTools implements IRouterTools {
  public config: IConfig;
  // TODO: leverage typescript decorator for memoize
  public cache: IRouterToolsCache;

  constructor (config: IConfig) {
    this.config = config;
    // TODO: implement optional localStorage cache w/ config
    this.cache = {
      split: {},
      match: {},
      process: {}
    };
  }

  /*
   *
   */
  _cacheKey(route: string, source: string) {
    return btoa(`${route} + ${source}`);
  }

  /*
   *
   */
  split (route: string, source: string) {
    const key = this._cacheKey(route, source);

    if(!this.cache.split[key]) {
      let parts = route.split(this.config.settings.hash);

      if (parts.length === 2) {
        if (this.config.settings.useFragments) {
          // TODO: revise when implementing fragment identification
          parts = parts.join('').split('#')[0].split('');
        }
        // remove query arguments from route
        // remove expected empty first element
        parts = parts.join('').split('?')[0].split('/').slice(1);
      } else {
        // default to route "/"
        parts = ['/'];
      }

      this.cache.split[key] = {
        route: parts,
        // split source path and remove expected empty first element
        source: source.split('/').slice(1)
      };
    }

    return this.cache.split[key];
  }

  match (route: string, source: string) {
    const key = this._cacheKey(route, source);

    if (!this.cache.match[key]) {
      const result = this.split(route, source);

      if (result.route.length === result.source.length) {
        for (const i in result.source) {
          if (result.source[i].startsWith(':') || result.route[i] === result.source[i]) {
            continue;
          }
          this.cache.match[key] = false;
          return false;
        }
        this.cache.match[key] = true;
        return true;
      }

      this.cache.match[key] = false;
      return false;
    }

    return this.cache.match[key];
  }

  process (route: string, source: string) {
    const key = this._cacheKey(route, source);

    // TODO: left here, process route details using source
    return {

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
  public $location: IRouterLocation;
  public $previous: IRouterLocation;

  constructor (args: IRouterArgs) {
    this.config = Object.assign(args.config || {}, Config);
    this.client = args.client;
    this.running = false;
    this.legacySupport = !('onpopstate' in window);

    this.$tools = new RouterTools(this.config);

    Object.defineProperty(this, '$location', {
      get: () => {
        return {
          hash: window.location.hash,
          href: window.location.href
        };
      },
      set: (location: string) => {
        window.history.pushState(null, null, location);
      }
    });
  }

  /*
   *
   */
  watch () {
    // TODO: make ambiguous, must be able to run only on route change w/ interval

    if (this.running) {
      // let navigated =
      if (this.client && this.client.onNavigate) {
        this.client.onNavigate({
          router: this,
          location: this.$location,
          previous: this.$previous,
        });

        this.$previous = this.$location;
      }
    }
  }

  /*
   *
   */
  start () {
    if (!this.running) {
      this.running = true;
      if (this.client && this.client.onStart) {
        this.client.onStart({
          router: this,
        });
      }
      if (this.legacySupport) {
        setInterval(this.watch, this.config.intervals.listener);
      } else {
        window.addEventListener('popstate', this.watch.bind(this));
      }
    }
  }

  /*
   *
   */
  stop () {
    // TODO: ensure stop works as expected when binding watcher
    if (this.running) {
      this.running = false;
      if (this.client && this.client.onStop) {
        this.client.onStop({
          router: this,
        });
      }
      if (this.legacySupport) {
        window.removeEventListener('popstate', this.watch);
      } else {
        clearInterval(this.listenerKey);
      }
    }
  }
}

module.exports = Router;
