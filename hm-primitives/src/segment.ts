
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

    strokeWeight(sqrt(this.length))
    line(0, 0, this.length, 0)
    
    
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