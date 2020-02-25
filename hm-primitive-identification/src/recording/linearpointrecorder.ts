
import * as p5 from "p5/index"
import Segment from "../arm/segment"
import IRecorder from "./irecorder.js"


/**
 *
 * Linearly distributes points along segments and records their
 * coordinates in the world frame into table, like this example
 * |------|-----------|----------|-------|-------|
 * | time | SegmentID | Location |   x   |   y   |
 * |  0.0 |         0 |       10 |  1.4  |  0.1  |
 * |  0.1 |         0 |       10 |  1.2  |  0.4  |
 * |------|-----------|----------|-------|-------|
 * 
 * @class LinearPointRecorder
 * @implements {IRecorder}
 */
export default class LinearPointRecorder implements IRecorder {
    
    private data: {
        time: number,
        segID: number,
        location: number,
        x: number,
        y: number
    }[] = []

    /**
     *Creates an instance of LinearPointRecorder.
     * @param {number} [dx=10]
     * @memberof LinearPointRecorder
     */
    constructor(private dx: number = 10) {
    }

    preparePoints(rootSegment: Segment) {
    }

    captureFrame(timestamp: number, rootSegment: Segment) {

        let xbase = 0
        let ybase = 0
        let angle = 0
        let segment = rootSegment
        
        for(let segment = rootSegment; segment.children.length > 0; segment = segment.children[0].seg) {

            angle = segment.angle

            for(let loc = 0; loc < rootSegment.length; loc += this.dx) {
                
                let x = xbase + loc + Math.cos(angle)
                let y = ybase + loc + Math.sin(angle)

                this.data.push({
                    time: timestamp,
                    segID: segment.id,
                    location: loc,
                    x: x, 
                    y: y
                })
            }
    
            xbase += rootSegment.length * Math.cos(angle)   
            ybase += rootSegment.length * Math.sin(angle)
        }   
    }
    
    draw(graphic: p5.Graphics): void {
        
        graphic.translate(graphic.width / 2, graphic.height / 2)
        
        // let scaleFactor = Math.min(graphic.width, graphic.height) / 100
        // graphic.scale(scaleFactor)



        throw new Error("Method not implemented.")
    }

    saveDataFile() {

        let csvContent = "data:text/csv;charset=utf-8," 
            + ["time", "segmentID", "location", "x", "y\n"].join(",")
            + this.data.map(d => `${d.time},${d.segID},${d.location},${d.x},${d.y}`).join("\n");

        let encodedUri = encodeURI(csvContent)
        window.open(encodedUri)
    }
}