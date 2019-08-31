import { IConfig } from './config';
import { IStartEvent, IStopEvent, INavigateEvent, IReloadEvent, ITransitionEvent } from './event';

export interface IRouterClient {
  onStart (event: IStartEvent): any;
  onStop (event: IStopEvent): any;
  onNavigate (event: INavigateEvent): any;
  onReload (event: IReloadEvent): any;
  onTransition (event: ITransitionEvent): any;
}

export interface IRouterTools {
  process (route: string, source: string) : Object;
  match (route: string, source: string): boolean;
}

export interface IRouterLocation {
  hash: string;
  href: string;
}

export interface IRouterArgs {
  config?: IConfig;
  client?: IRouterClient;
}

export interface IRouter {
  config: IConfig;
  location: IRouterLocation;
  tools: IRouterTools;
  running: boolean;
  client?: IRouterClient;

  _run (): any;
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
