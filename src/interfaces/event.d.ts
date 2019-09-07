interface IRouterEvent {
  $tools?: any;
}

export interface IRouterLocation {
  path: string,
  hash: string;
  href: string;
}

export interface IStartEvent extends IRouterEvent {
  location: IRouterLocation
}

export interface IStopEvent extends IRouterEvent {

}

export interface INavigateEvent extends IRouterEvent {
  location: IRouterLocation;
  previous: IRouterLocation;
}
