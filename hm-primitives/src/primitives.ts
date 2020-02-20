import * as p5 from 'p5'

var isLooping = true
var transformer: P5Transformer;

var canvas: p5.Renderer
var buffer: p5.Graphics

let colors: p5.Color[]

var rootSegs: {loc: p5.Vector, seg: Segment}[]

var angleRates: number[]


var params = {
  rootSegs: {
    min: 1,
    max: 1
  },
  depth: {
    min: 4,
    max: 5
  },
  length: {
    min: 0.0625,
    max: 0.2125
  },
  angle: {
    startMin: 0,
    startMax: TWO_PI,
    incMin: 0.01,
    incMax: 0.15,
    randomCount: 10,
    randomRates: true
  },
  drawLines: false,
  drawDots: true,
  color: {
    offset: 0,
  }
}


function setup() {
  
  colors = [
      // https://paletton.com/#uid=75-0S0kmqsTcVHEidwXrnpUtBkl
    color(199, 29,  45),
    color(206, 139, 30),
    color(72,  111,  175),
    color(51,  172, 25),
    // https://paletton.com/#uid=7420S0kmqsTcVHEidwXrnpUtBkl
    color(97,  92,  180),
    color(144, 46,  150),
    color(174, 200, 29),
    color(206, 165, 30)
  ]

  params = {
    rootSegs: {
      min: 1,
      max: 1
    },
    depth: {
      min: 4,
      max: 5
    },
    length: {
      min: 0.0625,
      max: 0.2125
    },
    angle: {
      startMin: 0,
      startMax: TWO_PI,
      incMin: 0.01,
      incMax: 0.15,
      randomCount: 10,
      randomRates: false
    },
    drawLines: false,
    drawDots: true,
    color: {
      offset: floor(random(colors.length))
    }
  }



  if (params.angle.randomRates) {
    angleRates = []
    for(let i = 0; i < params.angle.randomCount; i++) {
      angleRates.push(random(params.angle.incMin, params.angle.incMax))
    }
  } else {
    angleRates = [
      0.10,
      0.05,
      0.025,
      0.075
    ]
  }

  rootSegs = []

  canvas = createCanvas(windowWidth, windowHeight - 40);
  
  frameRate(60)

  buffer = createGraphics(width, height)
  buffer.background(60);
  transformer = new P5Transformer()

  let minDim = min(width, height)
  const rootSegCount = round(random(params.rootSegs.min, params.rootSegs.max))
  for(let i = 0; i < rootSegCount; i++) {

    let length = random(params.length.min * minDim, params.length.max * minDim)
    let startAng = random(params.angle.startMin, params.angle.startMax)

    let rootSeg = new Segment(null, length, startAng);
    let seg = rootSeg
    let targetDepth = round(random(params.depth.min, params.depth.max))
    
    for(let seg = rootSeg, depth = 1; depth < targetDepth; depth ++) {
      seg = seg.addChild(seg.length, random(TWO_PI), random(params.length.min * minDim, params.length.max * minDim))
    }

    
    rootSegs.push({
      // random(width), random(height)
      loc: createVector(0, 0),
      seg: rootSeg
    })
  }

  createButton("Save without arms").mouseClicked(saveBuffer)
  createButton("Save with arms").mouseClicked(saveAll)
}

function saveBuffer(){
  save(buffer, "multidof-art.png")
}
function saveAll(){
  save(canvas, "multidof-arms-art.png")
}

function printLocation(seg: Segment) {
  // console.log(`seg[${seg.id}] at point: (${transformer.x}, ${transformer.y})`)
  
  let ci = (params.color.offset + seg.id) % colors.length;
  let c = colors[ci]
  buffer.stroke(c)
  // console.log(`Seg #${seg.id}\tcolor: ${ci}`)

  transformer.push()
  transformer.translate(seg.length, 0);

  let loc = {x: transformer.x, y: transformer.y}

  if (params.drawLines && seg.prevLoc) 
  {
    buffer.strokeWeight(1.5)
    buffer.line(seg.prevLoc.x, seg.prevLoc.y, loc.x, loc.y)
  }
  if (params.drawDots)
  {
    buffer.strokeWeight(5)
    buffer.point(transformer.x, transformer.y);
  }
  

  seg.prevLoc = loc

  transformer.pop();
}

function draw() {
  
  transformer.reset()

  image(buffer, 0, 0)
  transformer.translate(width / 2, height / 2);

  for(let rootSeg of rootSegs) {
    // transformer.push()
    // transformer.translate(rootSeg.loc.x, rootSeg.loc.y)
    rootSeg.seg.draw(transformer, printLocation);
    // transformer.pop()
  }

  for(let rootSeg of rootSegs) {
    rootSeg.seg.recurse((s: Segment) => {
      s.angle += angleRates[s.id % angleRates.length];
      s.angle %= 2 * PI;
    });
  }
}

function mouseClicked() {
  
  if(isLooping) {
    noLoop()
  } else {
    loop()
  }
  isLooping = !isLooping
}