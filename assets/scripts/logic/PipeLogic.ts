import { Node, UITransform, Vec2, Vec3 } from "cc"
import LogManager from "../base/helper/Logger";


export default class PipeLogic {
    pipeNode: Node
    _isTrigger: boolean
    constructor(node: Node) {
        this.pipeNode = node;
        this._isTrigger = false
    }

    getPipeUI(): Node {
        return this.pipeNode;
    }

    isTrigger(): boolean {
        return this._isTrigger;
    }

    setTrigger(val: boolean): void {
        this._isTrigger = val;
    }

    isPassedBirdPos(birdPos: Vec3): boolean {
        return this.pipeNode.worldPosition.x <= birdPos.x - 100;
    }

    scrollUI(gameSpeed: number, velocity: number, deltaTime: number) {
        const vel = gameSpeed * velocity * deltaTime;
        let oldPos = this.pipeNode.getPosition();
        this.pipeNode.setPosition(oldPos.subtract(new Vec3(vel, 0, 0)));
    }

    releaseUI(): void {
        this.pipeNode.removeFromParent();
    }

    isOutOfScreen() {
        return this.pipeNode.position.x <= -650;
    }

    isCollideWithBird(birdPos: Vec3): boolean {
        let top: Node = this.pipeNode.getChildByName("top");
        let bottom: Node = this.pipeNode.getChildByName("bottom");
        let posLeft = birdPos.clone().subtract(new Vec3(30, 0, 0));
        let posRight = birdPos.clone().add(new Vec3(30, 0, 0));
        let posTop = birdPos.clone().add(new Vec3(0, 20, 0));
        let posBottom = birdPos.clone().subtract(new Vec3(0, 20, 0));
        for (let pos of  [posLeft, posRight, posTop, posBottom]) {
            let local = this.pipeNode.getComponent(UITransform).convertToNodeSpaceAR(pos);
            if (top.getComponent(UITransform).getBoundingBox().contains(new Vec2(local.x, local.y))) return true;
            if (bottom.getComponent(UITransform).getBoundingBox().contains(new Vec2(local.x, local.y))) return true;
        }
        return false;
    }
}