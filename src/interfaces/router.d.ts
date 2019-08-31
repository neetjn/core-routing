import { IConfig } from './config';
import { IStartEvent, IStopEvent, INavigateEvent, IRouterLocation } from './event';

export interface IRouterClient {
  onStart (event: IStartEvent): any;
  onStop (event: IStopEvent): any;
  onNavigate (event: INavigateEvent): any;
}

export interface IRouterTools {
  process (route: string, source: string) : Object;
  match (route: string, source: string): boolean;
}

export interface IRouterArgs {
  config?: IConfig;
  client?: IRouterClient;
}

export interface IRouter {
  config: IConfig;
  location: IRouterLocation;
  previous: IRouterLocation,
  tools: IRouterTools;
  running: boolean;
  client?: IRouterClient;

  watch(): any;
  start (): any;
  stop (): any;
}

/*

    import { Router, RouterClient } from 'core-routing'
import { IConfig } from './config';

    const client: RouterClient = new RouterClient({
        onStart(event: StartEvent) {

        },
        onNavigate(event: NavigateEvent) {

        }
    })

    const Router =
*/
