import * as p5 from 'p5'

var rootSeg: Segment

var isLooping = true
var transformer: P5Transformer;

var buffer: p5.Graphics

let colors: p5.Color[]

function setup() {
  createCanvas(800, 800);
  
  frameRate(30)

  buffer = createGraphics(width, height)
  transformer = new P5Transformer()

  https://paletton.com/#uid=75-0S0kmqsTcVHEidwXrnpUtBkl
  colors = [
    color("#C71D2D"),
    color("#CE8B1E"),
    color("#1D4C87"),
    color("#33AC19")
  ]

  rootSeg = new Segment(null, 140, PI / 2);
  
  rootSeg.addChild(140, PI / 3, 100)
         .addChild(100, PI / 2, 60)
}

function printLocation(seg: Segment) {
  console.log(`seg[${seg.id}] at point: (${transformer.x}, ${transformer.y})`)
  buffer.strokeWeight(5)
  buffer.stroke(colors[seg.id])
  buffer.point(transformer.x, transformer.y);
}

function draw() {
  background(240);
  
  transformer.reset()

  image(buffer, 0, 0)
  transformer.translate(width / 2, height / 2);

  rootSeg.draw(transformer, printLocation);

  rootSeg.recurse((s: Segment) => {
    s.angle += 0.1;
    s.angle %= 2 * PI;
  });
}

function mouseClicked() {
  
  if(isLooping) {
    noLoop()
  } else {
    loop()
  }
  isLooping = !isLooping
}