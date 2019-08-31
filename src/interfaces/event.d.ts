interface IRouterEvent {
  router?: any;
}

export interface IStartEvent extends IRouterEvent {

}

export interface IStopEvent extends IRouterEvent {

}

export interface IRouterLocation extends IRouterEvent {
  hash: string;
  href: string;
}

export interface INavigateEvent extends IRouterEvent {
  location: IRouterLocation;
  previous: IRouterLocation;
}
