import { EventTouch } from "cc";

export default interface ITouchInput {
    onTouchStart(event: EventTouch): void;
    onTouchMoved(event: EventTouch): void;
    onTouchEnded(event: EventTouch): void;
}