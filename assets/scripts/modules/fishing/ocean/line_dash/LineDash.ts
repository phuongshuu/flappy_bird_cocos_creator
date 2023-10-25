import { _decorator, Component, Graphics, Node, size, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LineDash')
export class LineDash extends Component {
    start() {
        const g = this.getComponent(Graphics);
        g.lineWidth = 10;
        g.fillColor.fromHEX('#ffffff');
        let screenSize = view.getVisibleSize();
        g.moveTo(-screenSize.width, 0);
        g.lineTo(screenSize.width, 0);
        g.lineTo(screenSize.width, -2);
        g.lineTo(-screenSize.width, -2);
        g.lineTo(-screenSize, 0);
        g.close();
        g.fill();
    }

    update(deltaTime: number) {
        
    }
}


