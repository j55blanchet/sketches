
class Segment {
  parent: Segment;
  children: Segment[];
  length: number;
  
  constructor(parent: Segment, length: number){
    this.parent = parent;
    this.length = length;
    this.children = [];
  }
  
  draw() {
   for(let c of this.children){
      c.draw(); 
   }  
  }
}