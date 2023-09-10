
import { _decorator, Component, AudioSource, assert, macro, director } from 'cc';
import { AudioManager } from './AudioManager';
import PlayerData from '../data/PlayerData';
import LogManager, { Logger } from '../base/helper/Logger';
const { ccclass, property } = _decorator;

declare const cocosAnalytics: any;
// macro.CLEANUP_IMAGE_CACHE = false;
// DynamicAtlasManager.instance.enabled = false;
// DynamicAtlasManager.instance.maxFrameSize = 1024;

@ccclass('GameRoot')
export class GameRoot extends Component {

    @property(AudioSource)
    private _audioSource: AudioSource = null!;

    private logger: Logger = LogManager.getLogger(GameRoot.name);

    onLoad () {
        const audioSource = this.getComponent(AudioSource)!;
        assert(audioSource);
        this._audioSource = audioSource;
        director.addPersistRootNode(this.node);
        // init AudioManager
        AudioManager.instance.init(this._audioSource);
    }

    start(){
        if(typeof cocosAnalytics !== 'undefined'){
            cocosAnalytics.enableDebug(true);
        }
        this.logger.debug("Start Game");
        director.loadScene("Fishing");
    }
}