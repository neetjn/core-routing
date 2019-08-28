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

export interface IRouter {
  client?: IRouterClient;
  running: boolean;
  _run (): any;
  start (): any;
  stop (): any;
}

/*

    import { Router, RouterClient } from 'core-routing'

    const client: RouterClient = new RouterClient({
        onStart(event: StartEvent) {

        },
        onNavigate(event: NavigateEvent) {

        }
    })

    const Router =
*/
