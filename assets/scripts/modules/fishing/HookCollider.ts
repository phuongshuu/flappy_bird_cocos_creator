import { _decorator, Collider2D, Component, Contact2DType, EPhysics2DDrawFlags, Node, PhysicsSystem2D, SkeletalAnimation, Skeleton, sp } from 'cc';
import LogManager from '../../base/helper/Logger';
import { FishingMgr } from './FishingMgr';
import { RodState } from './Rod';
import { Fish } from './Fish';
const { ccclass, property } = _decorator;

@ccclass('HookCollider')
export class HookCollider extends Component {
    @property({ type: FishingMgr })
    mgr: FishingMgr;
    start() {
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape;
    }
    onBeginContact(a: Collider2D, b: Collider2D) {
        LogManager.getGlobalLog().debug("Begin Contact", a.node.name, b.node.name);
        if (b.node.name == "FishBody") {
            this.onBeginContactFish(b);
            return;
        }
    }
    onBeginContactFish(collider: Collider2D) {
        if (this.mgr.rod.state != RodState.CASTING) return;
        if (this.mgr.collidedFish != null) return;
        this.mgr.collidedFish = collider.node.parent.parent.getComponent(Fish);
        let skeleton = collider.node.parent.getComponent(sp.Skeleton);
        skeleton.setAnimation(0, "caught", true);
    }
    onEndContact(a: Collider2D, b: Collider2D) {
        
    }

    update(deltaTime: number) {

    }
}


