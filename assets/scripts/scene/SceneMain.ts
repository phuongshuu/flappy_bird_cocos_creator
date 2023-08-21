import { _decorator, Button, Component, Label, Node, Sprite, UI } from 'cc';
import LogManager, { Logger } from '../helper/Logger';
import ActionQueue from '../logic/GameControl';
import ClickPlayAction from '../logic/actions/ClickPlayAction';
import UIUtils from '../utils/UIUtils';
import PlayerData from '../data/PlayerData';
const { ccclass, property } = _decorator;

@ccclass('SceneMain')
export class SceneMain extends Component {
    @property({type: Button})
    btnPlay: Button = null;
    
    @property({type: Button})
    btnCoin: Button = null;
    
    @property({type: Button})
    btnMenu: Button = null;

    @property({type: Label})
    lbScore: Label = null;

    @property({type: Label})
    lbSpin: Label = null;

    @property({type: Label})
    lbTime: Label = null;

    @property({type: Label})
    lbCoin: Label = null;

    @property({type: Label})
    lbRankPoint: Label = null;

    @property({type: Sprite})
    imgBgUfo: Sprite = null;


    private logger: Logger = LogManager.getLogger(SceneMain.name);
    private actionQueue: ActionQueue = new ActionQueue();

    onLoad () {
        this.btnPlay.node.on(Button.EventType.CLICK, this.onClickPlay, this);
    }
    protected start(): void {
        this.imgBgUfo.node.active = false;
        this.lbScore.node.active = false;
        this.updateData();
    }

    updateData():void {
        this.lbCoin.string = UIUtils.moneyToString(PlayerData.instance.coin);
        this.lbRankPoint.string = UIUtils.moneyToString(PlayerData.instance.rankPoint);
        this.lbSpin.string = UIUtils.moneyToString(PlayerData.instance.energies) + "/50";
    }
    onClickPlay(btn: Button) {
        this.logger.debug("Btn " + btn.name  + " is clicked");
        this.actionQueue.queueAction(new ClickPlayAction("clickPlay", 2, {}));
    }
    protected update(dt: number): void {
        this.actionQueue.loop(dt);
    }
}


