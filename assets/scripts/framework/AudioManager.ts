import { _decorator, AudioClip, sys, AudioSource, assert, clamp01, warn } from "cc";
import { ResourceUtil } from "../utils/ResourceUtils";

export class AudioManager {
    private static _instance: AudioManager;
    private static _audioSource?: AudioSource;

    static get instance () {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new AudioManager();
        return this._instance;
    }

    soundVolume: number = 1;

    // init AudioManager in GameRoot.
    init (audioSource: AudioSource) {
        // this.soundVolume = this.getConfiguration(false) ? 1 : 0;
        AudioManager._audioSource = audioSource;
        this.openMusic();
        this.openSound();
    }

    playMusic (loop: boolean) {
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');
        audioSource.loop = loop;
        if (!audioSource.playing) {
            audioSource.play();
        }
    }

    playSound (name:string) {
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');

        let path = 'audio/';

        ResourceUtil.loadRes(path + name, AudioClip, (err, clip)=> {
            if (err) {
                warn('load audioClip failed: ', err);
                return;
            }

            audioSource.playOneShot(clip, audioSource.volume ? this.soundVolume / audioSource.volume : 0);
        });

    }

    setMusicVolume (flag: number) {
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');

        flag = clamp01(flag);
        audioSource.volume = flag;
    }

    setSoundVolume (flag: number) {
        this.soundVolume = flag;
    }

    openMusic () {
        this.setMusicVolume(0.8);
        // configuration.instance.setGlobalData('music', 'true');
    }

    closeMusic () {
        this.setMusicVolume(0);
        // configuration.instance.setGlobalData('music', 'false');
    }

    openSound () {
        this.setSoundVolume(1);
        // configuration.instance.setGlobalData('sound', 'true');
    }

    closeSound () {
        this.setSoundVolume(0);
        // configuration.instance.setGlobalData('sound', 'false');
    }
}
