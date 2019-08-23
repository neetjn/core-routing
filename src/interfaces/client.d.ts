import { StartEvent, StopEvent, NavigateEvent, ReloadEvent, TransitionEvent } from './event';

export interface Client {
    onStart(event: StartEvent): any,
    onStop(event: StopEvent): any,
    onNavigate(event: NavigateEvent): any,
    onReload(event: ReloadEvent): any,
    onTransition(event: TransitionEvent): any
}

export interface Router {
    start(): any,
    stop(): any
}