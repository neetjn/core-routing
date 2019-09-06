import { Memoize } from 'typescript-memoize';
import { IRouterClient, IRouterTools, IRouterArgs, IRouter } from './interfaces/router';
import { IRouterLocation } from './interfaces/event';
import { IConfig } from './interfaces/config';
import { Config } from './config';

// TODO: add documentation

// TODO: complete router tools and implement in router
class RouterTools implements IRouterTools {
  public config: IConfig;

  constructor (config: IConfig) {
    this.config = config;
  }

  @Memoize()
  split (route: string, source: string) {
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

    return {
      route: parts,
      // split source path and remove expected empty first element
      source: source.split('/').slice(1)
    };
  }

  @Memoize()
  match (route: string, source: string) {
    const result = this.split(route, source);

    if (result.route.length === result.source.length) {
      for (const i in result.source) {
        if (!(result.source[i].startsWith(':') || result.route[i] === result.source[i])) {
          return false;
        }
      }
      return true;
    }

    return false;
  }

  process (route: string, source: string) {
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
  public $previous: IRouterLocation;

  constructor (args: IRouterArgs) {
    this.config = Object.assign(args.config || {}, Config);
    this.client = args.client;
    this.running = false;
    this.legacySupport = !('onpopstate' in window);
    this.$tools = new RouterTools(this.config);
    this.$previous = {
      hash: '',
      href: ''
    };
  }

  get $location () {
    return {
      hash: window.location.hash,
      href: window.location.href
    };
  }

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
        window.clearInterval(this.listenerKey);
      }
    }
  }
}

module.exports = Router;
