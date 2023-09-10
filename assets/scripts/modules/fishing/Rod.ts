import { _decorator, Component, director, Node, NodeSpace, Quat, Size, UITransform, Vec3 } from 'cc';
import LogManager from '../../base/helper/Logger';
import { Fish } from './Fish';
import { FishingMgr } from './FishingMgr';
const { ccclass, property } = _decorator;

const ROD_LINE_ANGLE_MAX = 50;
const ROD_LINE_ANGLE_MIN = -ROD_LINE_ANGLE_MAX;
const DANGLING_VELOCITY = 40.0;

export const enum RodState {
    NONE = 0,
    DANGLIN = 1,
    CASTING = 2,
    PULLING = 3
}

@ccclass('Rod')
export class Rod extends Component {
    @property({ type: Node })
    rodLine: Node;
    @property({ type: Node })
    rodHook: Node;
    private _state: RodState;
    public get state(): RodState {
        return this._state;
    }
    public set state(value: RodState) {
        this._state = value;
    }
    private _curLineAngle: number;
    private _danglingVelocity: number;
    private _castingVelocity: number;
    private _pullingVelocity: number;
    private _lineLength: number;
    public get lineLength(): number {
        return this._lineLength;
    }
    public set lineLength(value: number) {
        this._lineLength = value;
    }
    private _fish: Fish;
    public get fish(): Fish {
        return this._fish;
    }
    public set fish(value: Fish) {
        this._fish = value;
    }
    private _maxLineLength: number;
    public get maxLineLength(): number {
        return this._maxLineLength;
    }
    public set maxLineLength(value: number) {
        this._maxLineLength = value;
    }
    start() {
        this._danglingVelocity = DANGLING_VELOCITY;
        this._castingVelocity = 400;
        this._pullingVelocity = this._castingVelocity * 3;
        this._curLineAngle = 0;
        this._state = RodState.NONE;
        this._lineLength = 40;
        this._fish = null;
        this._maxLineLength = 500;
    }
    private dangleLine(deltaTime: number) {
        this._curLineAngle += deltaTime * this._danglingVelocity;
        if (this._curLineAngle >= ROD_LINE_ANGLE_MAX) {
            this._curLineAngle = ROD_LINE_ANGLE_MAX;
            this._danglingVelocity *= -1;
        }
        if (this._curLineAngle <= ROD_LINE_ANGLE_MIN) {
            this._curLineAngle = ROD_LINE_ANGLE_MIN;
            this._danglingVelocity *= -1;
        }
        this.rodLine.setRotation(Quat.fromAngleZ(new Quat(), this._curLineAngle));
    }

    getHook() {
        return this.rodHook;
    }

    private castLine(deltaTime: number) {
        this._lineLength += this._castingVelocity * deltaTime;
        if (this._lineLength >= this._maxLineLength) {
            this._lineLength = this._maxLineLength;
            this.state = RodState.PULLING;
        }
        let transform = this.rodLine.getComponent(UITransform);
        transform.setContentSize(new Size(transform.contentSize.width, this._lineLength));
    }

    private pullLine(deltaTime: number) {
        this._fish != null && this.pullFish(deltaTime);
        this._fish == null && this.pullEmptyLine(deltaTime);
        let transform = this.rodLine.getComponent(UITransform);
        transform.setContentSize(new Size(transform.contentSize.width, this._lineLength));
        if (this._lineLength > 40) return;
        this._lineLength = 40;
        this.state = RodState.DANGLIN;
        this.resetFish();
    }

    private pullEmptyLine(deltaTime: number) {
        this._lineLength += -this._pullingVelocity * deltaTime;
    }

    private pullFish(deltaTime: number) {
        this._lineLength += -Math.max(100, (this._castingVelocity - this._fish.weight * 20)) * deltaTime;
    }

    private resetFish() {
        LogManager.getGlobalLog().debug("Pull done!");
        if (this._fish != null) {
            this._fish.node.removeFromParent();
            director.getScene().getComponentInChildren(FishingMgr).spawnFish();
        }
        this._fish = null;
    }

    cast(){
        this.state = RodState.CASTING;
        LogManager.getGlobalLog().debug("Catch Fish");
    }

    private updateHook() {
        this.rodHook.setPosition(this.rodHook.position.x, -this.rodLine.getComponent(UITransform).contentSize.height);
    }

    update(deltaTime: number) {
        this.updateHook();
        this._state === RodState.DANGLIN && this.dangleLine(deltaTime);
        this._state === RodState.CASTING && this.castLine(deltaTime);
        this._state === RodState.PULLING && this.pullLine(deltaTime);
    }
}


