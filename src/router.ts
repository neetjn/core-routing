import { IRouterClient, IRouterTools, IRouterLocation, IRouterArgs, IRouter } from './interfaces/router';
import { IConfig } from './interfaces/config';
import { Config } from './config';

export class Router implements IRouter {
  public config: IConfig;
  public location: IRouterLocation;
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

  _run() {

  }

  start () {
    setInterval(this._run, this.config.intervals.start);
  }

  stop () {

  }
}
