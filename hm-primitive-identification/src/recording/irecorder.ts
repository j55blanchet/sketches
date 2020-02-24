
import Segment from "../arm/segment"
import * as p5 from "p5/index"

export default interface IRecorder {

    preparePoints(rootSegment: Segment): void

    captureFrame(timestamp: number, rootSegment: Segment): void

    draw(graphic: p5.Graphics): void
}