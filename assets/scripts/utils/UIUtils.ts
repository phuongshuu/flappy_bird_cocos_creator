import {EventTouch, Input, input, RenderTexture, native, director, Camera, Material } from "cc";
import LogManager from "../base/helper/Logger";

export default class UIUtils {
    static logger = LogManager.getLogger(UIUtils.name);
    public static addTouchEvent(comp: any): void {
        input.on(Input.EventType.TOUCH_START, comp.onTouchStart, comp);
        input.on(Input.EventType.TOUCH_MOVE, comp.onTouchMoved, comp);
        input.on(Input.EventType.TOUCH_END, comp.onTouchEnded, comp);
        input.on(Input.EventType.TOUCH_CANCEL, comp.onTouchCanceled, comp);
    }

    public static removeTouchEvent(comp: any): void {
        this.logger.debug("removeTouchEvent", comp.constructor.name);
        input.off(Input.EventType.TOUCH_START, comp.onTouchStart, comp);
        input.off(Input.EventType.TOUCH_MOVE, comp.onTouchMoved, comp);
        input.off(Input.EventType.TOUCH_END, comp.onTouchEnded, comp);
        input.off(Input.EventType.TOUCH_CANCEL, comp.onTouchCanceled, comp);
    }

    public static saveScreenShot(filename: string) {
        var renderTex = new RenderTexture();
        renderTex.reset({
            width: 540,
            height: 960,
        });
        let camera = director.getScene().getChildByName("Canvas").getChildByName("Camera").getComponent(Camera);
        camera.targetTexture = renderTex;
        const width = 540;
        const height = 960;
        const data = renderTex.readPixels(0, 0, width, height);
        let filePath =  native.fileUtils.getWritablePath() + filename + '.png';
        this.logger.debug("File Path: ", filePath);
        native.saveImageData(data, width, height, filePath);
        camera.targetTexture = null;
    }

    public static moneyToString(money: number, minValue = 100000000): string {
        let ret = "";
        let suffix = "";
        if (money > minValue) {
            suffix = "M";
            let intergral: number = Math.floor(money / 1000000);
            let remain: number =  money - intergral * 1000000;
            let precision: number = parseFloat((remain / 1000000).toFixed(1));
            if (precision >= 0.1) intergral += precision;
            return intergral + "M"
        }
        let tmp = money.toString();
        if (tmp.length < 3) return tmp;
        let i = tmp.length;
        while (i >= 0) {
            let num = Math.max(i - 3, 0);
            ret =  tmp.slice(num, i) + "." + ret;
            i -= 3;
        }
        return ret;
    }
}