import { _decorator, Component, Node, UITransform, Vec3, view } from 'cc';
import { Fish, FishState } from './Fish';
const { ccclass } = _decorator;

@ccclass('FishMovement')
export class FishMovement extends Component {
    update(deltaTime: number) {
        let data = this.node.getComponent(Fish);
        if (data == null) return;
        if (data.state != FishState.SWIMMING) return;
        let newPos = new Vec3(this.node.position.x + data.velocityX * deltaTime,
            this.node.position.y,
            0
        );
        let screenSize = view.getVisibleSize();
        if (newPos.x > screenSize.width / 2 - this.node.getComponentInChildren(UITransform).width / 2 && data.velocityX > 0) {
            newPos.x = screenSize.width / 2 - this.node.getComponentInChildren(UITransform).width / 2;
            data.velocityX *= -1;
        }
        if (newPos.x <= -screenSize.width / 2 + this.node.getComponentInChildren(UITransform).width / 2 && data.velocityX < 0) {
            newPos.x = -screenSize.width / 2 + this.node.getComponentInChildren(UITransform).width / 2;
            data.velocityX *= -1;
        }
        this.node.setPosition(newPos);
    }
}


