export interface IListener<T> {
  (event: T): any;
}

export interface IDisposable {
  dispose ();
}

export interface IEmitter<T> {
  listeners: IListener<T>[];
  listenersOncer: IListener<T>[];

  on (listener: IListener<T>): IDisposable;
  once (listener: IListener<T>): void;
  off (listener: IListener<T>);
  emit (event: T);
  pipe (te: Emitter<T>): IDisposable;
}
