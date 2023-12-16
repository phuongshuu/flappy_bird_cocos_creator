import { _decorator, Canvas, Component, director, Node, RichText, RigidBody2D, UITransform, Vec2, Vec3, view } from 'cc';
import LogManager from '../../base/helper/Logger';
import { FishMovement } from './FishMovement';
const { ccclass, property } = _decorator;

export enum FishState {
    NONE = 0,
    SWIMMING = 1,
    PULLING = 2
}

@ccclass('Fish')
export class Fish extends Component {
    private _fishId: number;
    public get fishId(): number {
        return this._fishId;
    }
    public set fishId(value: number) {
        this._fishId = value;
    }
    private _velocityX: number;
    public get velocityX(): number {
        return this._velocityX;
    }
    public set velocityX(value: number) {
        this._velocityX = value;
    }
    private _weight: number;
    public get weight(): number {
        return this._weight;
    }
    public set weight(value: number) {
        this._weight = value;
    }
    private _state: FishState;
    public get state(): FishState {
        return this._state;
    }
    public set state(value: FishState) {
        this._state = value;
    }
    start(): void {
        LogManager.getGlobalLog().debug(
            "Fish " + this._fishId,
            "Weight: " + this._weight,
            "VelocityX: " + this._velocityX
        )
        this.node.getComponentInChildren(RichText).string = "<color=#ff0000>@num kg</color>".replace("@num", this._weight.toFixed(2).toString());
    }
}


