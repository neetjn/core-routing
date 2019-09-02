import { IRouterClient, IRouterTools, IRouterArgs, IRouter } from './interfaces/router';
import { IRouterLocation } from './interfaces/event';
import { IConfig } from './interfaces/config';
import { Config } from './config';

// TODO: add documentation

// TODO: complete router tools and implement in router
class RouterTools implements IRouterTools {
  process (route: string, source: string) {
    return {

    };
  }

  match (route: string, source: string) {
    return false;
  }
}

class Router implements IRouter {
  public $location: IRouterLocation;
  public $previous: IRouterLocation;
  public $tools: IRouterTools;
  public config: IConfig;
  public running: boolean;
  public legacySupport: boolean;
  public listenerKey?: number;
  public client?: IRouterClient;

  constructor (args: IRouterArgs) {
    this.config = Object.assign(args.config || {}, Config);
    this.client = args.client;
    this.running = false;

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

    this.legacySupport = !('onpopstate' in window);
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

  stop () {
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
