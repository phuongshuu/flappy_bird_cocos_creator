
import { _decorator, Component, director, EventTouch, Node, Prefab, Sprite, SpriteFrame, UITransform, Vec3, Animation, instantiate, Label, TiledObjectGroup, tween, Game, Quat, Camera, game, assetManager, Texture2D, ImageAsset, Vec2, Size, UI } from 'cc';
import LogManager, { Logger } from '../helper/Logger';
import UIUtils from '../utils/UIUtils';
import PipeLogic from '../logic/PipeLogic';
import { AudioManager } from '../framework/AudioManager';
const { ccclass, property } = _decorator;


export enum GameState {
    Playing,
    GameOver,
    Waiting,
    Dying
}

@ccclass('SceneGame')
export class SceneGame extends Component {
    @property({
        type: SpriteFrame
    })
    sFDay: SpriteFrame = null;
    @property({
        type: SpriteFrame
    })
    sFNight: SpriteFrame = null;
    @property({
        type: Node
    })
    imgBgScroll_1: Node = null;

    @property({
        type: Node
    })
    imgBgScroll_2: Node = null;

    @property({
        type: Node
    })
    imgBaseScroll_1: Node = null;

    @property({
        type: Node
    })
    imgBaseScroll_2: Node = null;

    @property({
        type: Node
    })
    bird: Node = null;

    @property({
        type: Node
    })
    pipesParent: Node = null;

    @property({
        type: Node
    })
    imgGameOver: Node = null;


    @property({
        type: Prefab
    })
    pipe: Prefab = null;

    @property({
        type: Node
    })
    nodeLabelScore: Node = null;

    @property({
        type: Node
    })
    camera: Node = null;

    logger: Logger = LogManager.getLogger(SceneGame.name);


    gameSpeed: number = 1;
    birdVelocity: number = 1;
    bgVelocity: number = 50;
    pipeVelocity: number = 150;
    baseVelocity: number = 200;
    birdStep: number = -7;
    state: GameState;
    pipeList: Array<PipeLogic> = [];
    spawnPipeTime: number = 300 / this.gameSpeed / this.pipeVelocity; //s  gameSpeed * pipeVelocity
    timeSpawnCounter: number
    score: number
    minPipeY: number = -80;
    maxPipeY: number = 230;

    maxRotBird: number = 15;
    minRotBird: number = -90;
    timeFall: number = 0.9;
    fallTimer: number
    start() {
        this.state = GameState.Waiting;
        this.imgGameOver.getComponent(Sprite).enabled = false;
        this.bird.getComponent(Animation).play("bird_flap");
        this.score = 0;

    }

    spawnPipe(): void{ 
        let pos = new Vec3(0, this.minPipeY + Math.random() * (this.maxPipeY - this.minPipeY), 0);
        let pipeUI = instantiate(this.pipe);
        pipeUI.setPosition(pos);
        const pipeLogic = new PipeLogic(pipeUI);
        this.pipesParent.addChild(pipeUI);
        this.pipeList.push(pipeLogic);
        this.resetTimeSpawnCounter();
    }

    triggerStartPlay(): void {
        this.state = GameState.Playing;
        this.spawnPipe();
        this.nodeLabelScore.active = true;

        //https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80
        // const link:string = "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80";
        // assetManager.loadRemote<ImageAsset>(link, {ext: '.png'}, (err, imageAsset) => {
        //     this.imgBgScroll_1.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(imageAsset);
        //     this.imgBgScroll_1.getComponent(UITransform).setContentSize(new Size(288, 512));
        //     assetManager.releaseAsset(imageAsset);
        // });
        // UIUtils.saveScreenShot("capture");
    }

    protected onLoad(): void {
        UIUtils.addTouchEvent(this);
    }

    jump(): void {
        this.birdVelocity = this.birdStep;
        AudioManager.instance.playSound('wing');
        this.bird.setRotationFromEuler(new Vec3(0, 0,  Math.min(((this.birdVelocity) / this.birdStep), 1.0) * this.maxRotBird));
        this.fallTimer = 0;
    }

    protected onDestroy(): void {
        UIUtils.removeTouchEvent(this);
    }

    onTouchStart(event: EventTouch) {
        switch (this.state) {
            case GameState.Waiting:
                this.triggerStartPlay();
            case GameState.Playing:
                this.jump();
                break;
            case GameState.GameOver:
                director.loadScene(director.getScene().name);
                UIUtils.removeTouchEvent(this);
                break;
        }
    }

    isNeedToRepositionBg(bg: Node) {
        const width = bg.getComponent(UITransform).contentSize.width * bg.scale.x;
        return bg.position.x < - width;
    }

    updatePositionScrollNode(updateNode: Node, pivotNode: Node) {
        const width = updateNode.getComponent(UITransform).contentSize.width * updateNode.scale.x;
        let oldPos = pivotNode.getPosition();
        updateNode.setPosition(oldPos.add(new Vec3(width, 0, 0)));
    }

    scrollBackGround(deltaTime: number) {
        const vel = this.gameSpeed * this.bgVelocity * deltaTime;
        let oldPos = this.imgBgScroll_1.getPosition();
        this.imgBgScroll_1.setPosition(oldPos.subtract(new Vec3(vel, 0, 0)));
        oldPos = this.imgBgScroll_2.getPosition();
        this.imgBgScroll_2.setPosition(oldPos.subtract(new Vec3(vel, 0, 0)));
    }

    scrollBase(deltaTime: number) {
        const vel = this.gameSpeed * this.baseVelocity * deltaTime;
        let oldPos = this.imgBaseScroll_1.getPosition();
        this.imgBaseScroll_1.setPosition(oldPos.subtract(new Vec3(vel, 0, 0)));
        oldPos = this.imgBaseScroll_2.getPosition();
        this.imgBaseScroll_2.setPosition(oldPos.subtract(new Vec3(vel, 0, 0)));
    }

    scrollPipe(deltaTime: number) {
        this.pipeList.forEach(pipeL => pipeL.scrollUI(this.gameSpeed, this.pipeVelocity, deltaTime));
        this.timeSpawnCounter += deltaTime;
    }

    moveBird(deltaTime: number) {
        this.birdVelocity += deltaTime * 17;
        this.fallTimer += deltaTime;
        const vel = this.birdVelocity;
        let oldPos = this.bird.getPosition();
        this.bird.setPosition(oldPos.subtract(new Vec3(0, vel, 0)));
        this.fallTimer > this.timeFall && this.bird.setRotationFromEuler(new Vec3(0, 0,  Math.min(((this.fallTimer * 1.2 - this.timeFall) / this.timeFall), 1.0) * this.minRotBird));
    }

    isGameOver(): boolean {
        return this.isBirdCollideWithBase() 
        || this.isBirdCollideWithPipe()
        || this.isBirdCollideWithRoof();
    }

    isBirdCollideWithRoof(): boolean {
        return this.bird.position.y >= 455;
    }

    loop(deltaTime: number) {
        this.scrollBackGround(deltaTime);
        this.scrollBase(deltaTime);
        this.scrollPipe(deltaTime);
        this.moveBird(deltaTime);
        if (this.isGameOver()) {
            AudioManager.instance.playSound('hit');
            this.state = GameState.Dying;
            this.playDying();
            this.bird.getComponent(Animation).stop();
        }
    }

    isBirdCollideWithBase() : boolean {
        return this.bird.position.y <= -269;
    }

    isBirdCollideWithPipe() : boolean {
        for (let pipeL of this.pipeList) {
            if (pipeL.isCollideWithBird(this.bird.getWorldPosition())) return true;
        }
        return false;
    }

    showGameOver(): void {
        this.imgGameOver.getComponent(Sprite).enabled = true;
        this.nodeLabelScore.active = false;
    }

    resetTimeSpawnCounter(): void {
        this.timeSpawnCounter = 0;
    }

    update(deltaTime: number) {
        this.state === GameState.Playing && this.loop(deltaTime);
    }

    checkRemovePipe(){
        if (this.pipeList.length <= 0) return;
        if (!this.pipeList[0].isOutOfScreen()) return;
        const pipeL =  this.pipeList.splice(0, 1)[0];
        pipeL.releaseUI();
        this.logger.debug("Remove Pipe");
    }

    updateScrore(): void {
        for (let pipeL of this.pipeList) {
            if (pipeL.isTrigger()) continue;
            if (!pipeL.isPassedBirdPos(this.bird.worldPosition)) continue;
            ++this.score;
            pipeL.setTrigger(true);
            AudioManager.instance.playSound('point');
        }
        this.nodeLabelScore.getComponent(Label).string = this.score + "";
    }
    
    shakeScreen(): void {
        tween(this.camera)
        .by(0.05, {position: new Vec3(10, 0, 0)})
        .by(0.05, {position: new Vec3(-10, 0,0)})
        .start();
    }

    shakeScreenUp(): void {
        tween(this.camera)
        .by(0.1, {position: new Vec3(0, -10, 0)})
        .by(0.05, {position: new Vec3(0, 10,0)})
        .start();
    }

    playDying(): void{
        this.shakeScreen();
        tween(this.bird)
        .call(()=>{
            AudioManager.instance.playSound('die');
            tween(this.bird)
            .to(Math.max((this.bird.position.y + 290) / 960, 0), {eulerAngles: new Vec3(0, 0, -90)})
            .start();
        })
        .by(0.1, {position: new Vec3(0, 30, 0)})
        .by(Math.max((this.bird.position.y + 269) / 960, 0), {position: new Vec3(0, - (this.bird.position.y + 290), 0)}, {
            easing: "cubicIn",
        })
        .call(()=>{this.state = GameState.GameOver})
        .start();
    }

    protected lateUpdate(dt: number): void {
        this.isNeedToRepositionBg(this.imgBgScroll_1) && this.updatePositionScrollNode(this.imgBgScroll_1, this.imgBgScroll_2);
        this.isNeedToRepositionBg(this.imgBgScroll_2) && this.updatePositionScrollNode(this.imgBgScroll_2, this.imgBgScroll_1);


        this.isNeedToRepositionBg(this.imgBaseScroll_1) && this.updatePositionScrollNode(this.imgBaseScroll_1, this.imgBaseScroll_2);
        this.isNeedToRepositionBg(this.imgBaseScroll_2) && this.updatePositionScrollNode(this.imgBaseScroll_2, this.imgBaseScroll_1);

        this.updateScrore();

        this.checkRemovePipe();

        if (this.state === GameState.GameOver) this.showGameOver(); 
        this.timeSpawnCounter >= this.spawnPipeTime && this.spawnPipe();
    }
}
