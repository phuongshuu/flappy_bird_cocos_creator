import { _decorator, Component, Graphics, instantiate, IRect, log, Node, Prefab, tween, UITransform, Vec2, view } from 'cc';
import { SteeredVehicle } from '../SteeredVehicle';
import { Fish, FishState } from '../Fish';
import LogManager from '../../../base/helper/Logger';
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
        let script = fish.getComponent(Fish);
        script.fishId = new Date().getTime();
        script.weight = 10 + Math.random() * 40;
        script.state = FishState.SWIMMING;
        this._listFish.push(fish);
        let flocker = fish.getComponent(SteeredVehicle);
        fish.position.set( - 1000, 0, 0);
        flocker.velocity.set(1);
        flocker.position.set(this._leftPoint[Math.floor(Math.random() * 3)]);
        flocker.targetPos.set(this._rightPoint[Math.floor(Math.random() * 3)]);
        flocker.maxSpeed = 1;
        flocker.maxForce = 0.5;
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
        this._wrap = {
            x: - size.width / 2,
            y: - 220,
            width: size.width,
            height: 220
        };
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
        // LogManager.getGlobalLog().debug(this._elapseTime);
        this._elapseTime += deltaTime;
        // if (this._elapseTime % 4 == 0) this.spawnFish();
        let size = view.getVisibleSize();
        this._listFish.forEach(f => {
            let flocker = f.getComponent(SteeredVehicle);
            flocker.flock(this._listFish.map(f => f.getComponent(SteeredVehicle)));
            // flocker.seek(flocker.targetPos);
            flocker.fixedUpdate();
            flocker.wrap({ 
                x: -size.width / 2 - flocker.node.getComponentInChildren(UITransform).width, 
                y: -size.height / 2 - flocker.node.getComponentInChildren(UITransform).height,
                width: size.width + flocker.node.getComponentInChildren(UITransform).width,
                height: size.height + flocker.node.getComponentInChildren(UITransform).height
            });
            
        });
    }
}


