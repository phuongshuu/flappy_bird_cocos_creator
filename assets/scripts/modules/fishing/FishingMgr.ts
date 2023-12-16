import { _decorator, Button, Canvas, Component, director, EventTouch, instantiate, log, Node, PolygonCollider2D, Prefab, UITransform, Vec3, view } from 'cc';
import UIUtils from '../../utils/UIUtils';
import { Rod, RodState } from './Rod';
import LogManager, { Logger } from '../../base/helper/Logger';
import { Fish, FishState } from './Fish';
import { eMenu } from '../../../resources/import/easyMenu/src/eMenu';
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
    private _collidedFish: Fish;
    public get collidedFish(): Fish {
        return this._collidedFish;
    }
    public set collidedFish(value: Fish) {
        this._collidedFish = value;
    }

    configMenu() {
        this._logger.debug("Config Menu");
        let menu = this.node.parent.getChildByName("Canvas").getComponentInChildren(eMenu);
        if (!menu) {
            this._logger.debug("Menu not found!");
            return;
        }
        let group = menu.addGroup("God Mode");
        group.addEdit("Weight", 1, ()=>{});
        group.addEdit("Velocity", 10, ()=>{});
        group.addItem("Spawn Fish", this.spawnFish.bind(this));
    }

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
        this.rod.setListener({
            onPullDone: ()=>{
                this.collidedFish = null;
            }
        });
        this.rod.state = RodState.DANGLIN;
        this._listFish = [];
        this.configMenu();
    }
    getCollidedFish(): Fish {
        return this.collidedFish;
    }

    update(): void {
        if (this.rod.state !== RodState.CASTING) return;
        if (this.collidedFish == null) return;

        this.collidedFish.state = FishState.PULLING;
        this.collidedFish.node.removeFromParent();
        this.rod.getHook().addChild(this.collidedFish.node);
        this.collidedFish.node.setPosition(new Vec3(
            0, 
            -this.rod.getHook().getComponent(UITransform).height / 2 - this.collidedFish.node.getComponent(UITransform).height / 2)
            );
        this.rod.fish = this.collidedFish;
        this.rod.state = RodState.PULLING;
    }

    onTouchStart(_event: EventTouch) {
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


