/** 
 * jsonmotion.ts
 * author: Julien Blanchet
 * date created: 2/24/2020
*/

import * as p5 from "p5/index";
import Segment from '../arm/segment.js'
import IMotion from './imotion.js'

// console.log(import.meta);

export type RunJSON = {
    runtimeSecs: number,
    segments: {
        length: number,
        angle: number
        motion: {
            time: number,
            dw: number
        }[]
    }[]
};

/**
 * Executes a motion defined in a JSON file. See the "RunJSON" type to understand the required
 * format of the JSON document. This class assumes that there is only one arm present in the sketch
 * (if there are multiple, it will execute the same motion for all of them).
 *
 * @export
 * @class JsonMotion
 * @implements {IMotion}
 */
export default class JsonMotion implements IMotion {

    private startTime: Date | undefined
    private finished = false

    private data: RunJSON | undefined | Error

    private motionIndexes: any = {}

    constructor(
        public p: p5,
        private filename: string = "/hm-primitive-identification/data/run.json"
    ) {
    }

    preload() {
        
        this.data = this.p.loadJSON(this.filename) as unknown as RunJSON
    }

    performMotion(s: Segment) {
        if (!this.data || this.data instanceof Error) {
            throw new Error("Can't perform motion - motion isn't loaded or has error")
        }
        if (!this.startTime) {
            this.startTime = new Date()
        }

        let elapsedTime = this.elapsedTimeSecs()
        
        this.motionIndexes[s.id] = this.motionIndexes[s.id] ?? 0
        
        let seg_i = s.depth - 1
        let motion = this.data.segments[seg_i].motion
        if (!motion) {
            debugger;
        }
        let motion_i = this.motionIndexes[s.id]
        
        if (motion.length > motion_i + 1  && motion[motion_i + 1].time < elapsedTime) {
            motion_i += 1
            this.motionIndexes[s.id] = motion_i
        }

        let dw = motion[motion_i].dw
        let dt = this.p.deltaTime / 1000
        let da = dw * dt
        s.angle += da
        s.angle %= this.p.TWO_PI

        console.log(`[${elapsedTime.toFixed(2)}] MOVE Seg #${s.id} MotionI:${motion_i} dw: ${dw.toFixed(2)} dt: ${dt.toFixed(2)} da: ${da.toFixed(4)}`)
    }

    isDone(): boolean {

        if (this.finished || this.data instanceof Error) { return true }
        if (this.data === undefined || this.startTime === undefined) { return false }

        this.finished = this.elapsedTimeSecs() > this.data.runtimeSecs
        return this.finished
    }

    isLoaded(): boolean {
        return this.data !== undefined
    }

    private elapsedTimeSecs(): number {
        if (this.startTime == undefined) { return 0.0 }
        return (new Date().getTime() - this.startTime.getTime()) / 1000
    }

    private checkdata(data: RunJSON) {
        if (data === undefined || data === null) {
            throw new ReferenceError("Data is null or undefined")
        }

        if (!data.runtimeSecs || !data.segments || !Array.isArray(data.segments)){
            throw new Error("Data missing toplevel properties")
        }
        if (data.segments.length === 0) {
            throw new Error("Motion must have at least one segment")
        }

        function checkMotion(prevMotionWasInvalid: boolean, motion: {time: number, dw: number}[]){
            return prevMotionWasInvalid || 
                   !Array.isArray(motion) || 
                   motion.length < 1 || 
                   motion[0].time !== 0.0
        }

        if (data.segments.map(s => s.motion).reduce(checkMotion, false)) {
            throw new Error("All segments must contain at least one motion entry, and the first motion entry must be at time == 0")
        }

        // Data seems good :D
    }
}
