
import * as p5 from "p5/index"
import Segment from "./segment.js";

// console.log(import.meta);

export default interface IArmBuilder {

    preload(): void

    buildRoots(colors: p5.Color[]): {loc: p5.Vector, seg: Segment}[]
}