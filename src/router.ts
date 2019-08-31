import { IRouterClient, IRouterTools, IRouterArgs, IRouter } from './interfaces/router';
import { IRouterLocation } from './interfaces/event';
import { IConfig } from './interfaces/config';
import { Config } from './config';

class Router implements IRouter {
  public config: IConfig;
  public location: IRouterLocation;
  public previous: IRouterLocation;
  public tools: IRouterTools;
  public running: boolean;
  public client?: IRouterClient;

  constructor (args: IRouterArgs) {
    this.config = args.config || Config;
    this.client = args.client;
    this.running = false;

    Object.defineProperty(this, 'location', {
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

  watch () {
    if (this.running) {
      if (this.client && this.client.onNavigate) {
        this.client.onNavigate({
          router: this,
          location: this.location,
          previous: this.previous,
        });
      }
    }
  }

  start () {
    if (!this.running) {
      if (this.client && this.client.onStart) {
        this.client.onStart({
          router: this,
        });
      }
      window.addEventListener('hashchange', this.watch);
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
      window.removeEventListener('hashchange', this.watch);
    }
  }
}

module.exports = Router;
