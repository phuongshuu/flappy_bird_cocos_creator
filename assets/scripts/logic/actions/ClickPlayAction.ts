import LogManager from "../../helper/Logger";
import { ActionData } from "../GameControl";
import BaseAction from "./BaseAction";

export default class ClickPlayAction extends BaseAction {
    constructor(id: string, actionTime: number, actionData: ActionData) {
        super(id, actionTime, actionData);
    }
    doAction(): void {
        LogManager.getGlobalLog().debug("Do Action ClickPlayAction");
    }
}