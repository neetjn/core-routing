interface IRouterEvent {
  $tools?: any;
}

export interface IRouterLocation {
  path: string;
  hash: string;
  href: string;
}

export interface IStartEvent extends IRouterEvent {
  location: IRouterLocation;
}

export interface IStopEvent extends IRouterEvent {
  location: IRouterLocation;
}

export interface INavigateEvent extends IRouterEvent {
  location: IRouterLocation;
  previous: IRouterLocation;
}

export type IEventHandler = (
  handler: IStartEvent | IStopEvent | INavigateEvent
) => void;
