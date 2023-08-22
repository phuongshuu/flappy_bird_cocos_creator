import { _decorator, Button, Component, director, Node, UITransform } from 'cc';
import { BasePopup } from '../../base/ui/BasePoup';
import { CommonPopupType } from '../../global/constants/Constant';
const { ccclass, property } = _decorator;

@ccclass('CommonPopup')
export class CommonPopup extends BasePopup {
    type: CommonPopupType;
    @property({type: Button})
    btnOneOption: Button = null;

    @property({type: Button})
    btnFirstOption: Button = null;

    @property({type: Button})
    btnSecondOption: Button = null;

    constructor(type: CommonPopupType){
        super();
        this.type = type != null ? type : CommonPopupType.OneButton;

    }

    updateUI() {
        switch (this.type) {
            case CommonPopupType.OneButton:
                this.updateUIOneButton();
                break;
            case CommonPopupType.TwoButton:
                this.updateUITwoButton();
                break;
        }
    }
    updateUITwoButton() {
        this.btnFirstOption.node.active = true;
        this.btnSecondOption.node.active = true;
        this.btnOneOption.node.active = false;
    }
    updateUIOneButton() {        
        this.btnFirstOption.node.active = false;
        this.btnSecondOption.node.active = false;
        this.btnOneOption.node.active = true;
    }

    start() {
        this.updateUI();
    }
}

