import { _decorator, Canvas, Component, director, EventTouch, instantiate, Node, Prefab, UITransform, Vec3, view } from 'cc';
import UIUtils from '../../utils/UIUtils';
import { Rod, RodState } from './Rod';
import LogManager, { Logger } from '../../base/helper/Logger';
import { Fish, FishState } from './Fish';
import { SteeredVehicle } from './SteeredVehicle';
import { Zone } from './ocean/Zone';
const { ccclass, property } = _decorator;

@ccclass('FishingMgr')
export class FishingMgr extends Component {
    @property({ type: Rod })
    rod: Rod;
    @property({ type: Node })
    nodeFish: Node;
    @property({ type: Prefab })
    fishPrefab: Prefab;
    _logger: Logger = LogManager.getLogger(FishingMgr.name);
    _listFish: Array<Fish>;
    flockers: SteeredVehicle[] = [];

    @property(Node)
    zone_1: Node;
    
    @property(Node)
    zone_2: Node;
    
    @property(Node)
    zone_3: Node;


    spawnFish() {
        let fish = instantiate(this.fishPrefab);
        let script = fish.getComponent(Fish);
        script.fishId = new Date().getTime();
        script.weight = 10 + Math.random() * 40;
        script.velocityX = 30 + Math.random() * 100;
        script.state = FishState.SWIMMING;
        script.enabled = false;
        this.nodeFish.addChild(fish);
        this._listFish.push(script);
        this.flockers.push(fish.getComponent(SteeredVehicle));
    }

    start(): void {
        this.rod.state = RodState.DANGLIN;
        this._listFish = [];
        // for (let i = 0; i < 10; ++i) {
        //     this.spawnFish();
        // }
        // this.flockers.forEach(f => {
        //     f.velocity.set(10);
        //     f.position.set(Math.random() * 600 - 300, Math.random() * 400 - 200);
        //     f.maxSpeed = 5;
        //     f.maxForce = 0.5;
        // });
        director.getScene().getComponentInChildren(Canvas).getComponent(UITransform).setContentSize(view.getVisibleSize());
        this.zone_1.getComponent(Zone).depth = 1;
        this.zone_2.getComponent(Zone).depth = 2;
        this.zone_3.getComponent(Zone).depth = 3;
    }
    getCollidedFish(): Fish {
        for (let i = this._listFish.length - 1; i >= 0; --i) {
            let fish = this._listFish[i];
            let diffVec = Vec3.subtract(new Vec3(), fish.node.worldPosition, this.rod.getHook().worldPosition);
            if (diffVec.length() <= 40) return this._listFish.splice(i, 1)[0];
        }
        return null;
    }

    update(): void {
        if (this.rod.state !== RodState.CASTING) return;
        let fish = this.getCollidedFish();
        if (fish == null) return;
        fish.state = FishState.PULLING;
        fish.node.removeFromParent();
        this.rod.getHook().addChild(fish.node);
        fish.node.setPosition(new Vec3(0, -this.rod.getHook().getComponent(UITransform).height /2 - fish.node.getComponentInChildren(UITransform).height / 2));
        this.rod.fish = fish;
        this.rod.state = RodState.PULLING;
    }
    onTouchEnded(event: EventTouch) {
        this.rod.state === RodState.DANGLIN && this.rod.cast();
    }
    //add touch
    onLoad(): void { UIUtils.addTouchEvent(this) }
    onDestroy(): void { UIUtils.removeTouchEvent(this) }
    //remove touch
}


