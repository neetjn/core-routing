import { IListener, IDisposable, IEmitter } from './interfaces/emitter';

export class Emitter<T> implements IEmitter<T> {
  public listeners: IListener<T>[] = [];
  public listenersOncer: IListener<T>[] = [];

  on (listener: IListener<T>): IDisposable {
    this.listeners.push(listener);
    return {
      dispose: () => this.off(listener)
    };
  }

  once (listener: IListener<T>): void {
    this.listenersOncer.push(listener);
  }

  off (listener: IListener<T>) {
    const callbackIndex = this.listeners.indexOf(listener);
    if (callbackIndex > -1) {
      this.listeners.splice(callbackIndex, 1);
    }
  }

  emit (event: T) {
    /** Update any general listeners */
    this.listeners.forEach((listener) => listener(event));

    /** Clear the `once` queue */
    if (this.listenersOncer.length > 0) {
      const toCall = this.listenersOncer;
      this.listenersOncer = [];
      toCall.forEach((listener) => listener(event));
    }
  }

  pipe (te: Emitter<T>): IDisposable {
    return this.on((e) => te.emit(e));
  }
}
