import LogManager, { Logger } from "../helper/Logger";

export interface ActionData {

}

export interface Action {
    id: string;
    actionTime: number;
    data: ActionData;
    doAction(): void;
}



export default class ActionQueue {
    private _queue: Array<Action>;
    private _curAction: Action;
    private _elapseTime: number
    private _logger: Logger
    constructor() {
        this._queue = [];
        this._curAction = null;
        this._elapseTime = 0;
        this._logger = LogManager.getLogger(ActionQueue.name);
    }
    queueAction(action: Action): void {
        if (this._curAction == null) {
            this._curAction = action;
            this.startCurAction();
            return;
        }
        this._queue.push(action);
        this._logger.debug("Queue Action " + action.id);
    }
    private startCurAction(): void {
        this._elapseTime = 0;
        this._logger.debug("Start Action " + this._curAction.id);
        this._curAction.doAction();
    }
    loop(dt: number) :void {
        if (this._curAction == null) return;
        this._elapseTime += dt;
        if (this._elapseTime >= this._curAction.actionTime) {
            this._logger.debug("Finish Action " + this._curAction.id + " in " + this._elapseTime);
            this._curAction = this._queue.shift();
            this._curAction != null && this.startCurAction();
        }
    }

}