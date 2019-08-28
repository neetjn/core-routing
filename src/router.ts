import { IRouterClient, IRouterTools, IRouter } from './interfaces/router';

export class Router implements IRouter {
  private client: IRouterClient;
  public running: boolean = false;

  constructor (client?: IRouterClient) {

  }

  _run() {

  }

  start () {
    setInterval(this._run, 500);
  }

  stop () {

  }
}
