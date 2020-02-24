/**
 * Project adopted from https://github.com/GoSubRoutine/Ball-in-the-Chamber
 */

import * as p5 from "p5/index"
import Segment from './segment.js'
import IMotion from './imotion'
import ConstantMotion from './constantmotion.js'
import P5Transformer from './p5transformer.js'

console.log(import.meta);

export default function sketch(p: p5) {

  let isLooping = true
  let transformer: P5Transformer;

  let canvas: p5.Renderer
  let buffer: p5.Graphics

  let colors: p5.Color[]
  let rootSegs: {loc: p5.Vector, seg: Segment}[]
  let motion: IMotion

  let params:  {
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
  } = {
    width: p.windowWidth,
    height: p.windowHeight,
    rootSegs: {
      min: 1,
      max: 1,
      locs: 
      "random",
      // [createVector(-1020, 0),
        // createVector(0, 0),
        // createVector(1020, 0)]
    },
    depth: {
      min: 3,
      max: 3
    },
    length: {
      masterScale: 1,
      min: 0.0455,
      max: 0.2525
    },
    angle: {
      startMin: 0,
      startMax: p.TWO_PI,
    },
    drawing: {
      backgroundColor: p.color(250),
      pointSize: 34,
      lineWeight: 8,
      specificDepth: [3, 4, 5], //, 5, 6, 7, 8],
      specificOpacity: 100,
      drawArms: true,
      drawLines: true,
      drawDots: true, 
    },    
    color: {
      offset: 0
    },
    motion: {
      durationSecs: 1.0
    }
  }

  p.setup = function (this: typeof p) {
    colors = [
        // https://paletton.com/#uid=75-0S0kmqsTcVHEidwXrnpUtBkl
      this.color(199, 29,  45,  40),
      this.color(206, 139, 30,  40),
      this.color(72,  111, 175, 40),
      this.color(51,  172, 25,  40) ,
      // https://paletton.com/#uid=7420S0kmqsTcVHEidwXrnpUtBkl
      // color(97,  92,  180, 40),
      // color(144, 46,  150, 40),
      // color(174, 200, 29,  40),
      // color(206, 165, 30,  40)
    ]
    
    this.createCanvas(1000, 1000)
    motion = new ConstantMotion(this, params.motion.durationSecs)

    let randomCol = () => { let ci = this.round(this.random(colors.length - 1)); return colors[ci]}

    rootSegs = []

    canvas = this.createCanvas(params.width, params.height);
    
    this.frameRate(60)
    this.background(params.drawing.backgroundColor)
    buffer = this.createGraphics(this.width, this.height)
    
    transformer = new P5Transformer(this)

    let minDim = this.min(this.width, this.height)
    const rootSegCount = this.round(this.random(params.rootSegs.min, params.rootSegs.max))
    for(let i = 0; i < rootSegCount; i++) {

      let length = this.random(params.length.min * minDim, params.length.max * minDim)
      let startAng = this.random(params.angle.startMin, params.angle.startMax)

      let rootSeg = new Segment(null, length, startAng, undefined, randomCol());
      let targetDepth = this.round(this.random(params.depth.min, params.depth.max))
      
      for(let seg = rootSeg, depth = 1; depth < targetDepth; depth ++) {
        seg = seg.addChild(seg.length, this.random(this.TWO_PI), this.random(params.length.min * minDim, params.length.max * minDim), randomCol())
      }

      let loc = this.createVector(0, 0)
      if (params.rootSegs.locs != "random") {
        let locs = params.rootSegs.locs as unknown as p5.Vector[]
        let loci = i % params.rootSegs.locs.length
        loc = locs[loci]
      } else if (rootSegCount > 1) {
        loc = this.createVector(this.random(- this.width / 2, this.width / 2), this.random(- this.height / 2, this.height / 2))
      }
      
      rootSegs.push({
        loc: loc,
        seg: rootSeg
      })
    }

    createButtons()

  }.bind(p);

  let createButtons = function(this: typeof p) {
    this.createButton("Save Drawing (Transparent Background)").mouseClicked(saveBufferTransparent)
    this.createSpan("&nbsp;")
    this.createButton("Save Drawing (Opaque Background)").mouseClicked(saveBufferWithBackground)
    this.createSpan("&nbsp;")
    this.createButton("Save Screenshot").mouseClicked(saveAll)
  }.bind(p);

  let saveBufferWithBackground = function(this: typeof p){
    let buf2 = this.createGraphics(this.width, this.height)
    buf2.background(params.drawing.backgroundColor)
    buf2.image(buffer, 0, 0)
    this.save(buf2, "multidof-art.png")
  }.bind(p)

  let saveBufferTransparent = function(this: typeof p) {
    this.save(buffer, "multidof-art-transparent.png")
  }.bind(p)


  let saveAll = function(this: typeof p){
    this.save(canvas, "multidof-arms-art.png")
  }.bind(p)


  let printLocation = function(this: typeof p, seg: Segment) {
    // console.log(`seg[${seg.id}] at point: (${transformer.x}, ${transformer.y})`)
    
    if (motion.isDone()) {
      return
    }
  
    if (params.drawing.specificDepth != "all"){
  
      if (Array.isArray(params.drawing.specificDepth) && params.drawing.specificDepth.indexOf(seg.depth) < 0) {
        return
      } else if (typeof(params.drawing.specificDepth) == "number" && params.drawing.specificDepth !== seg.depth) {
        return
      }
    }
  
    let ci = (params.color.offset + seg.id) % colors.length;
    let c = seg.color ?? colors[ci]
  
    
    if (params.drawing.specificOpacity !== false) {
      c.setAlpha(params.drawing.specificOpacity)
    } else if (seg.depth == 1){
      c.setAlpha(8)
    } else {
      c.setAlpha(50 + seg.depth * 20)
    }
    
    
    buffer.stroke(c)
  
    
    // console.log(`Seg #${seg.id}\tcolor: ${ci}`)
  
    transformer.push()
    transformer.translate(seg.length, 0);
  
    let loc = {x: transformer.x, y: transformer.y}
  
    if (params.drawing.drawLines && seg.pLoc && seg.ppLoc && seg.pppLoc) 
    {
      
      buffer.strokeWeight(params.drawing.lineWeight)
      buffer.noFill()
  
      buffer.curve(seg.pppLoc.x, seg.pppLoc.y,
                   seg.ppLoc.x,  seg.ppLoc.y,
                   seg.pLoc.x,   seg.pLoc.y,
                   loc.x,        loc.y)
  
      // buffer.line(seg.pLoc.x, seg.pLoc.y, loc.x, loc.y)
    }
    if (params.drawing.drawDots)
    {
      buffer.strokeWeight(params.drawing.pointSize)
      buffer.point(transformer.x, transformer.y);
    }
    
    seg.pppLoc = seg.ppLoc;
    seg.ppLoc = seg.pLoc;
    seg.pLoc = loc
  
    transformer.pop();
  }.bind(p);



  p.draw = function (this: typeof p) {
    transformer.reset()

    this.background(params.drawing.backgroundColor)

    this.image(buffer, 0, 0)

    transformer.translate(this.width / 2, this.height / 2)
    if (params.length.masterScale !== 1) {
      transformer.scale(params.length.masterScale)
    }

    for(let rootSeg of rootSegs) {

      transformer.push()
      transformer.translate(rootSeg.loc.x, rootSeg.loc.y)
      rootSeg.seg.draw(this, transformer, params.drawing.drawArms, printLocation);
      transformer.pop()

    }

      // Perform motion!
    if (!motion.isDone()) {
      for(let rootSeg of rootSegs) {
        rootSeg.seg.recurse(s => motion.performMotion(s));
      }
    }
  }.bind(p);

  p.mouseClicked = function(this: typeof p) {
    if(isLooping) {
      this.noLoop()
    } else {
      this.loop()
    }
    isLooping = !isLooping
  }.bind(p);
}
