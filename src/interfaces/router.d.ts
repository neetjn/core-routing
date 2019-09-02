import { IConfig } from './config';
import { IStartEvent, IStopEvent, INavigateEvent, IRouterLocation } from './event';

export interface IRouterClient {
  onStart (event: IStartEvent): any;
  onStop (event: IStopEvent): any;
  onNavigate (event: INavigateEvent): any;
}

export interface IRouterToolsCache {
  split: Object,
  match: Object,
  process: Object
}

export interface IRouterTools {
  config: IConfig;
  cache: IRouterToolsCache;

  _cacheKey (route: string, source: string): string;
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

  $location: IRouterLocation;
  $previous: IRouterLocation,
  $tools: IRouterTools;

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
