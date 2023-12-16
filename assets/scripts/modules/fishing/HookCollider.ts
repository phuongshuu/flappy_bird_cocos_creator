import { _decorator, Collider2D, Component, Contact2DType, EPhysics2DDrawFlags, Node, PhysicsSystem2D } from 'cc';
import LogManager from '../../base/helper/Logger';
const { ccclass, property } = _decorator;

@ccclass('HookCollider')
export class HookCollider extends Component {
    start() {
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape;
    }
    onBeginContact(a: Collider2D, b: Collider2D) {
        LogManager.getGlobalLog().debug("Begin Contact", a.node.name, b.node.name);
    }
    onEndContact(a: Collider2D, b: Collider2D) {
        
    }

    update(deltaTime: number) {

    }
}


