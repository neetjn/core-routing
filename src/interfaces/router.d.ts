import { IConfig } from './config';
import { IStartEvent, IStopEvent, INavigateEvent, IRouterLocation } from './event';

export interface IRouterClient {
  onStart (event: IStartEvent): any;
  onStop (event: IStopEvent): any;
  onNavigate (event: INavigateEvent): any;
}

export interface IRouterTools {
  config: IConfig;

  split (route: string, source: string) : Object;
  match (route: string, source: string): boolean;
  process (route: string, source: string) : Object;
}

export interface IRouterArgs {
  config?: IConfig;
  client?: IRouterClient;
}

export interface IRouter {
  config: IConfig;
  running: boolean;
  legacySupport: boolean;
  listenerKey?: number;
  client?: IRouterClient;

  $tools: IRouterTools;
  $location: IRouterLocation;
  $previous: IRouterLocation,

  watch (): any;
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
