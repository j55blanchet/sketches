

import * as p5 from "p5/index"

export type IParams = {
    width: number,
    height: number,
    rootSegs: {
      min: number,
      max: number,
      locs: "random" | p5.Vector[]
    },
    depth: {
      min: number,
      max: number
    },
    length: {
      masterScale: number,
      min: number,
      max: number
    },
    angle: {
      startMin: number,
      startMax: number,
    },
    drawing: {
      backgroundColor: p5.Color,
      pointSize: number,
      lineWeight: number,
      specificDepth: number[] | number | "all",
      specificOpacity: number | false,
      drawLines: boolean,
      drawDots: boolean,
      drawArms: boolean
    },
    
    color: {
      offset: number,
    },
  
    motion: {
      durationSecs: number
    }
  }