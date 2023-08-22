import { Button, Component, Node, _decorator } from "cc";
const { ccclass, property } = _decorator;


@ccclass('BasePopup')
export class BasePopup extends Component {
    @property({ type: Node })
    blackLayout: Node = null;

    @property({type: Node})
    bgPopup: Node = null;

    @property({type: Button})
    btnClose: Button = null;

    onLoad () {
        this.btnClose.node.on(Button.EventType.CLICK, this.hide, this);
    }

    hide() {
        this.node.destroy();
    }
}