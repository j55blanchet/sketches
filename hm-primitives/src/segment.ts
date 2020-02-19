
class Segment {

  children: {pos: number, seg: Segment}[] = [];
  
  constructor(public parent: Segment | null, 
              public length: number, 
              public angle: number){
  }

  addChild(pos: number, ang: number, len: number): Segment{
    let seg = new Segment(this, len, ang)
    this.children.push({
      pos: pos,
      seg: seg
    })
    
    return seg
  }
  
  draw() {
    push()

    rotate(this.angle)

    let sr_len = sqrt(this.length)
    let h_sr_len = sr_len / 2

    stroke(30)
    fill(117, 53, 6)
    strokeWeight(2)
    rectMode(CENTER)
    rect(this.length / 2, 0, this.length + sr_len, sr_len, h_sr_len)

    strokeWeight(1)
    fill(225, 53, 6)
    ellipse(0, 0, h_sr_len, h_sr_len)
    
    
    for(let c of this.children){
      push()
      translate(c.pos, 0, 0)
      c.seg.draw()
      pop()
    }   
    
    pop()
  }

  recurse(f: (s: Segment) => void){
    f(this);
    for(let c of this.children){
      c.seg.recurse(f)
    }
  }
}