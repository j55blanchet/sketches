
import * as p5 from "p5/index"
import Segment from "./segment.js"
import IArmBuilder from "./iarmbuilder.js"
import { IParams } from "../p5utils/iparams.js"

// console.log(import.meta);

export default class ArtArmBuilder implements IArmBuilder {

    constructor(private p5: p5, private params: IParams){
    }

    preload(){}

    buildRoots(colors: p5.Color[]): {loc: p5.Vector, seg: Segment}[] {

        let rootSegs:{loc: p5.Vector, seg: Segment}[] = []

        let randomCol = () => { let ci = this.p5.round(this.p5.random(colors.length - 1)); return colors[ci]}

        let minDim = this.p5.min(this.p5.width, this.p5.height)
        const rootSegCount = this.p5.round(this.p5.random(this.params.rootSegs.min, this.params.rootSegs.max))
        for(let i = 0; i < rootSegCount; i++) {

        let length = this.p5.random(this.params.length.min * minDim, this.params.length.max * minDim)
        let startAng = this.p5.random(this.params.angle.startMin, this.params.angle.startMax)

        let rootSeg = new Segment(null, length, startAng, undefined, randomCol());
        let targetDepth = this.p5.round(this.p5.random(this.params.depth.min, this.params.depth.max))
        
        for(let seg = rootSeg, depth = 1; depth < targetDepth; depth ++) {
            seg = seg.addChild(seg.length, this.p5.random(this.p5.TWO_PI), this.p5.random(this.params.length.min * minDim, this.params.length.max * minDim), randomCol())
        }

        let loc = this.p5.createVector(0, 0)
        if (this.params.rootSegs.locs != "random") {
            let locs = this.params.rootSegs.locs
            let loci = i % this.params.rootSegs.locs.length
            loc = locs[loci]
        } else if (rootSegCount > 1) {
            loc = this.p5.createVector(this.p5.random(- this.p5.width / 2, this.p5.width / 2), this.p5.random(- this.p5.height / 2, this.p5.height / 2))
        }
        
        rootSegs.push({
            loc: loc,
            seg: rootSeg
        })
        }
        
        return rootSegs
    }

}