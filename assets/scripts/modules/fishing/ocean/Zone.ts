import { _decorator, Component, Graphics, instantiate, IRect, log, Node, Prefab, tween, UITransform, Vec2, view } from 'cc';
import { SteeredVehicle } from '../SteeredVehicle';
import { Fish, FishState } from '../Fish';
import LogManager from '../../../base/helper/Logger';
import { FishMovement } from '../FishMovement';
import { SwimLine } from '../SwimLine';
const { ccclass, property } = _decorator;

@ccclass('Zone')
export class Zone extends Component {
    @property(Prefab)
    fishPrefab: Prefab;
    _listFish: Array<Node> = [];
    private _wrap: IRect;
    _leftPoint: Array<Vec2>;
    _rightPoint: Array<Vec2>;
    private _depth: number = 1;
    private _elapseTime: number = 0;


    public get depth(): number {
        return this._depth;
    }
    public set depth(value: number) {
        this._depth = value;
    }

    public get wrap(): IRect {
        return this._wrap;
    }
    public set wrap(value: IRect) {
        this._wrap = value;
    }

    spawnFish() {
        let fish = instantiate(this.fishPrefab);
        //data
        let script = fish.getComponent(Fish);
        script.fishId = new Date().getTime();
        script.weight = 10 + Math.random() * 40;
        script.state = FishState.SWIMMING;
        //Movement
        let movement = fish.getComponent(FishMovement);
        movement.data = script;
        movement.swimLine = new SwimLine(this._leftPoint[Math.floor(Math.random() * 3)], this._rightPoint[Math.floor(Math.random() * 3)]);
        this._listFish.push(fish);
        LogManager.getGlobalLog().debug("Spawn Fish");
        this.node.addChild(fish);
    }

    start() {
        LogManager.getGlobalLog().debug("Start in " + this.name);
        let size = view.getVisibleSize();
        this._leftPoint = [
            new Vec2(-size.width / 2, 220 / 4),
            new Vec2(-size.width / 2, 220 / 4 * 2),
            new Vec2(-size.width / 2, 220 / 4 * 3)
        ];
        this._rightPoint = [
            new Vec2(size.width / 2, 220 / 4),
            new Vec2(size.width / 2, 220 / 4 * 2),
            new Vec2(size.width / 2, 220 / 4 * 3),
        ];
        let gp = this.node.getComponent(Graphics);
        if (gp == null) return;
        gp.fillColor.fromHEX("#ff0000");

        this._leftPoint.forEach(point => {
            gp.circle(point.x, point.y - 220, 5);
            gp.close();
            gp.fill();
        });
        this._rightPoint.forEach(point => {
            gp.circle(point.x, point.y - 220, 5);
            gp.close();
            gp.fill();
        });

        tween(this.node)
        .sequence(
            tween(this.node).delay(2),
            tween(this.node).call(()=>{
                this.spawnFish();
            })
        )
        .repeatForever()
        .start();
    
    }

    update(deltaTime: number) {
            
    }
}


