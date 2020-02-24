
import * as p5 from "p5/index"
import Segment from "./segment.js"
import IArmBuilder from "./iarmbuilder.js"
import { RunJSON } from "../motion/jsonmotion.js"

// console.log(import.meta);

export default class JsonArmBuilder implements IArmBuilder {

    private data: RunJSON | undefined = undefined

    constructor(private p5: p5, private filename: string = "/hm-primitive-identification/data/run.json"){
    }

    buildRoots(colors: p5.Color[]): {loc: p5.Vector, seg: Segment}[] {

        if (!this.data) {
            throw new Error("JSON Arm Data couldn't be loaded")
        }
        if (this.data.segments.length < 1) {
            throw new Error("Data must contain at least one segment.")
        }
        if (!colors || colors.length < 1) {
            throw new Error("Colors array missing or empty")
        }

        let root: Segment | null = null
        let seg: Segment | null = null
        let i = 0

        for(const segJson of this.data.segments) {

            let ci = i % colors.length

            if (!root) {
                root = new Segment(null, segJson.length, segJson.angle, 1, colors[ci])
                seg = root
            }
            else {
                seg = seg!.addChild(seg?.length ?? 0, segJson.angle, segJson.length, colors[ci])
            }

            i += 1
        }

        return [{
            loc: this.p5.createVector(0, 0),
            seg: root!
        }]
    }

    preload() {
        this.data = this.p5.loadJSON(this.filename) as RunJSON
    }
}