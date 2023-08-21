import { Action, ActionData } from "../GameControl";

export default class BaseAction implements Action {
    id: string;
    actionTime: number;
    data: ActionData;
    constructor(id: string, actionTime: number, actionData: ActionData) {
        this.id = id;
        this.actionTime = actionTime;
        this.data = actionData;
    }
    doAction(): void {
        throw new Error("Method not implemented.");
    }
}