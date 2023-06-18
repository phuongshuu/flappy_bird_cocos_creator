import {EventTouch, Input, input } from "cc";
import LogManager from "../helper/Logger";

export default class UIUtils {
    static logger = LogManager.getLogger(UIUtils.name);
    public static addTouchEvent(comp: any): void {
        input.on(Input.EventType.TOUCH_START, comp.onTouchStart, comp);
        input.on(Input.EventType.TOUCH_MOVE, comp.onTouchMoved, comp);
        input.on(Input.EventType.TOUCH_END, comp.onTouchEnded, comp);
        input.on(Input.EventType.TOUCH_CANCEL, comp.onTouchCanceled, comp);
    }

    public static removeTouchEvent(comp: any): void {
        this.logger.debug("removeTouchEvent", comp.constructor.name);
        input.off(Input.EventType.TOUCH_START, comp.onTouchStart, comp);
        input.off(Input.EventType.TOUCH_MOVE, comp.onTouchMoved, comp);
        input.off(Input.EventType.TOUCH_END, comp.onTouchEnded, comp);
        input.off(Input.EventType.TOUCH_CANCEL, comp.onTouchCanceled, comp);
    }
}