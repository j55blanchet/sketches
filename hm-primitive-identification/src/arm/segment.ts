import * as p5 from "p5/index";

import P5Transformer from "../p5utils/p5transformer.js"

// console.log(import.meta);

let gid = 0

export default class Segment {

  id: number
  children: {pos: number, seg: Segment}[] = [];
  pLoc: {x: number, y: number} | null = null;
  ppLoc: {x: number, y: number} | null = null;
  pppLoc: {x: number, y: number} | null = null;
  
  constructor(public parent: Segment | null, 
              public length: number, 
              public angle: number,
              public depth: number = 1,
              public color: any = undefined){
    this.id = gid
    gid += 1
  }

  addChild(pos: number, ang: number, len: number, color: any): Segment{
    let seg = new Segment(this, len, ang, this.depth + 1, color)
    this.children.push({
      pos: pos,
      seg: seg
    })
    
    return seg
  }
  
  draw(p:p5, transformer: P5Transformer, drawArms: boolean, callback?: (s: Segment) => void) {
    transformer.push()

    transformer.rotate(this.angle)

    let sr_len = p.sqrt(this.length)
    let h_sr_len = sr_len / 2

    if (drawArms) {

      p.stroke(30, 50)
      p.fill(30, 100)
      p.strokeWeight(h_sr_len)
      p.rectMode(p.CENTER)
      p.rect(this.length / 2, 0, this.length + sr_len, sr_len, h_sr_len)

      // strokeWeight(1)
      // fill(225, 53, 6, 100)
      // ellipse(0, 0, h_sr_len, h_sr_len)

      p.noStroke()
      p.fill(255, 150)
      p.ellipse(this.length, 0, h_sr_len, h_sr_len);
    }
    
    if (callback) {
      callback(this)
    }
    
    for(let c of this.children){
      transformer.push()
      transformer.translate(c.pos, 0)
      c.seg.draw(p, transformer, drawArms, callback)
      transformer.pop()
    }   
    
    transformer.pop()
  }

  recurse(f: (s: Segment) => void){
    f(this);
    for(let c of this.children){
      c.seg.recurse(f)
    }
  }
}