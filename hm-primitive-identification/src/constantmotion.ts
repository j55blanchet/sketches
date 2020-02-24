
import * as p5 from "p5/index";
import Segment from './segment'
import IMotion from './imotion'

console.log(import.meta);

export default class ConstantMotion implements IMotion {

    public angleRates: number[]

    private startTime: Date | undefined
    private finished = false

    constructor(
        public p: p5,
        public durationSecs: number
        ) {
        this.angleRates = [
            0.01,
            0.08,
            0.12,
            0.16,
            // 0.24,
            // 0.04,
            // 0.08,
            // 0.12,
        ]
    }

    performMotion(s: Segment) {
        s.angle += this.angleRates[s.depth % this.angleRates.length];
        s.angle %= this.p.TWO_PI

        if (!this.startTime) {
            this.startTime = new Date()
        }
    }

    isDone(): boolean {

        if (this.finished)               { return true  } 
        if (this.startTime == undefined) { return false }
    
        this.finished = (new Date().getTime() - this.startTime.getTime()) / 1000 > this.durationSecs
        return this.finished
    }
}
