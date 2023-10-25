import { _decorator, Canvas, Component, director, Node, RichText, UITransform, Vec2, Vec3, view } from 'cc';
import LogManager from '../../base/helper/Logger';
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

    update(deltaTime: number) {
        // this._state === FishState.SWIMMING && this.updateMove(deltaTime);
    }
    updateMove(deltaTime: number) {
        let newPos = new Vec3(this.node.position.x + this._velocityX * deltaTime, 
            this.node.position.y, 
            0
        );
        let screenSize = view.getVisibleSize();
        if (newPos.x > screenSize.width / 2 - this.node.getComponentInChildren(UITransform).width / 2 && this._velocityX > 0) {
            newPos.x = screenSize.width / 2 - this.node.getComponentInChildren(UITransform).width / 2;
            this._velocityX *= -1;
        }
        if (newPos.x <= -screenSize.width / 2 + this.node.getComponentInChildren(UITransform).width / 2 && this._velocityX < 0) {
            newPos.x = -screenSize.width / 2 + this.node.getComponentInChildren(UITransform).width / 2;
            this._velocityX*= -1;
        }
        this.node.setPosition(newPos);
    }
}


