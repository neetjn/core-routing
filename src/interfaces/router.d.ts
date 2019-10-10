import IEventEmitter from 'events';
import { IConfig } from './config';
import {
  IStartEvent,
  IStopEvent,
  INavigateEvent,
  IRouterLocation,
  IEventHandler
} from './event';

export interface IObject {
  [key: string]: any;
}

export interface IRouterClient {
  onStart (event: IEventHandler): void;
  onStop (event: IEventHandler): void;
  onNavigate (event: IEventHandler): void;
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
  client:? IRouterClient;
  config?: IConfig;
}

export interface IRouter {
  config: IConfig;
  running: boolean;
  legacySupport: boolean;
  listenerKey?: number;

  $emitter: IEventEmitter;
  $tools: IRouterTools;
  $location: IRouterLocation;
  $previous: IRouterLocation;

  watch (): void;
  start (): void;
  stop (): void;

  on (eventName: string, eventHandler: IEventHandler): void;
  off (eventName: string, eventHandler: IEventHandler): void;
  once(eventName: string, eventHandler: IEventHandler): void;
}
