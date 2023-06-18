
import { _decorator, Component, director, EventTouch, Node, Scene, Sprite, tween, UIOpacity } from 'cc';
import UserDataHelper, { TimePlay, UserDataType } from '../data/UserData';
import LogManager, { Logger } from '../helper/Logger';
import UIUtils from '../utils/UIUtils';
import { AudioManager } from '../framework/AudioManager';
const { ccclass, property } = _decorator;
 
@ccclass('SceneStarting')
export class SceneStarting extends Component {
    @property({
        type: Node
    })
    img_backgrond_day: Node = null
    @property({
        type: Node
    })
    img_backgrond_night: Node = null
    @property({
        type: Node
    })
    img_message: Node = null;
  
    logger: Logger = LogManager.getLogger(SceneStarting.name);
    protected onLoad(): void {
        UIUtils.addTouchEvent(this);
    }
    protected onDestroy(): void {
        UIUtils.removeTouchEvent(this);
    }
    onTouchStart(event: EventTouch) {
        AudioManager.instance.playSound('wing');
        director.preloadScene('SceneGame', (err) => {
            if (err) return;
            this.logger.debug("Preloaded SceneGame");
            director.loadScene('SceneGame', ()=>{});
        });
    }
    start () {
        let lastTimePlay = UserDataHelper.getString(UserDataType.LastPlayTime);
        if (lastTimePlay == null 
            || lastTimePlay === TimePlay[TimePlay.Night]) lastTimePlay = TimePlay[TimePlay.Day];
        else lastTimePlay = TimePlay[TimePlay.Night];
        UserDataHelper.saveString(UserDataType.LastPlayTime, lastTimePlay);
        this.img_backgrond_day.getComponent(Sprite).enabled = lastTimePlay === TimePlay[TimePlay.Day];
        this.img_backgrond_night.getComponent(Sprite).enabled = lastTimePlay === TimePlay[TimePlay.Night];

        let t1 = tween(this.img_message.getComponent(UIOpacity)).delay(1);
        let t2 = tween(this.img_message.getComponent(UIOpacity)).to(1, {opacity: 0})
        let t3 = tween(this.img_message.getComponent(UIOpacity)) .to(1, {opacity: 255})

        tween(this.img_message.getComponent(UIOpacity))
        .sequence(t1, t2, t3)
        .repeatForever()
        .start();
    }

}
