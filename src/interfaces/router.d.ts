import { IConfig } from './config';
import {
  IStartEvent,
  IStopEvent,
  INavigateEvent,
  IRouterLocation
} from './event';

export interface IObject {
  [key: string]: any;
}

export interface IRouterClient {
  onStart (event: IStartEvent): any;
  onStop (event: IStopEvent): any;
  onNavigate (event: INavigateEvent): any;
}

export interface IRouterToolsResult {
  query: string;
  fragment: string;
  route: Array<string>;
  source: Array<string>;
}

export interface IRouterToolsDetails {
  result: IRouterToolsResult;
  variables: IObject;
  args: IObject;
}

export interface IRouterTools {
  config: IConfig;

  inspect (route: string, source: string): IRouterToolsResult;
  match (route: string, source: string): boolean;
  process (route: string, source: string): IRouterToolsDetails;
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
  $previous: IRouterLocation;

  watch (): any;
  start (): any;
  stop (): any;
}
