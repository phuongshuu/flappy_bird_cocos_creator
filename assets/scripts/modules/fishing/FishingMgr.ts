import { _decorator, Button, Canvas, Component, director, EventTouch, instantiate, Node, PolygonCollider2D, Prefab, UITransform, Vec3, view } from 'cc';
import UIUtils from '../../utils/UIUtils';
import { Rod, RodState } from './Rod';
import LogManager, { Logger } from '../../base/helper/Logger';
import { Fish, FishState } from './Fish';
const { ccclass, property } = _decorator;

@ccclass('FishingMgr')
export class FishingMgr extends Component {
    @property({ type: Rod })
    rod: Rod;
    @property({ type: Node })
    nodeFish: Node;
    @property({ type: Prefab })
    fishPrefab: Prefab;
    @property({ type: Button })
    btnSpawnFish: Button;

    _logger: Logger = LogManager.getLogger(FishingMgr.name);
    _listFish: Array<Node>;

    spawnFish() {
        let fish = instantiate(this.fishPrefab);
        let script = fish.getComponent(Fish);
        script.fishId = new Date().getTime();
        script.weight = 10 + Math.random() * 40;
        script.velocityX = 30 + Math.random() * 100;
        script.state = FishState.SWIMMING;

        this.nodeFish.addChild(fish);
        this._listFish.push(fish);
    }

    start(): void {
        this.rod.state = RodState.DANGLIN;
        this._listFish = [];
    }
    getCollidedFish(): Fish {
        return null;
    }

    update(): void {
        if (this.rod.state !== RodState.CASTING) return;
        let fish = this.getCollidedFish();
        if (fish == null) return;

        fish.state = FishState.PULLING;
        fish.node.removeFromParent();
        this.rod.getHook().addChild(fish.node);
        fish.node.setPosition(new Vec3(
            0, 
            -this.rod.getHook().getComponent(UITransform).height / 2 - fish.node.getComponentInChildren(UITransform).height / 2)
            );
        this.rod.fish = fish;
        this.rod.state = RodState.PULLING;
    }
    onTouchEnded(_event: EventTouch) {
        this.rod.state === RodState.DANGLIN && this.rod.cast();
    }
    //add touch
    onLoad(): void {
        UIUtils.addTouchEvent(this);
        this.btnSpawnFish.node.on(Button.EventType.CLICK, this.spawnFish, this);
    }
    onDestroy(): void {
        UIUtils.removeTouchEvent(this)
        this.btnSpawnFish.node.off(Button.EventType.CLICK, this.spawnFish, this);
    }
    //remove touch
}


