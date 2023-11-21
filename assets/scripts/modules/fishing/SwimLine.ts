import { _decorator, Vec2 } from 'cc';

export class SwimLine {
    startPos: Vec2;
    endPos: Vec2;
    curPos: Vec2;
    constructor(sPos: Vec2, ePos: Vec2){
        this.startPos = sPos;
        this.endPos = ePos;
        this.curPos = this.startPos;
    }
    getNextPos(dt: number): Vec2 {
        return this.endPos.subtract(this.curPos).multiplyScalar(dt);
    }
    isFinishLine(): boolean {
        return this.curPos.subtract(this.endPos).length() <= 0.1;
    }
}