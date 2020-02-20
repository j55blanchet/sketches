import * as p5 from 'p5'

var isLooping = true
var transformer: P5Transformer;

var canvas: p5.Renderer
var buffer: p5.Graphics

let colors: p5.Color[]

var rootSegs: {loc: p5.Vector, seg: Segment}[]

var angleRates: number[]


var params: {
  rootSegs: {
    min: number,
    max: number
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
    incMin: number,
    incMax: number,
    randomCount: number,
    randomRates: boolean
  },
  drawing: {
    backgroundColor: p5.Color,
    pointSize: number,
    lineWeight: number,
    specificDepth: number | false,
    specificOpacity: number | false,
  },
  drawLines: boolean,
  drawDots: boolean,
  color: {
    offset: number,
  }
}


function setup() {
  createButton("Save Drawing (Transparent Background)").mouseClicked(saveBufferTransparent)
  createSpan("&nbsp;")
  createButton("Save Drawing (Opaque Background)").mouseClicked(saveBufferWithBackground)
  createSpan("&nbsp;")
  createButton("Save Screenshot").mouseClicked(saveAll)

  colors = [
      // https://paletton.com/#uid=75-0S0kmqsTcVHEidwXrnpUtBkl
    color(199, 29,  45,  40),
    color(206, 139, 30,  40),
    color(72,  111, 175, 40),
    color(51,  172, 25,  40) ,
    // https://paletton.com/#uid=7420S0kmqsTcVHEidwXrnpUtBkl
    color(97,  92,  180, 40),
    color(144, 46,  150, 40),
    color(174, 200, 29,  40),
    color(206, 165, 30,  40)
  ]

  params = {
    rootSegs: {
      min: 1,
      max: 1
    },
    depth: {
      min: 5,
      max: 5
    },
    length: {
      masterScale: 0.8,
      min: 0.0455,
      max: 0.2525
    },
    angle: {
      startMin: 0,
      startMax: TWO_PI,
      incMin: 0.01,
      incMax: 0.08,
      randomCount: 10,
      randomRates: false
    },
    drawing: {
      backgroundColor: color(240),
      pointSize: 10,
      lineWeight: 8,
      specificDepth: 5,
      specificOpacity: 100,
    },
    drawLines: true,
    drawDots: false, 
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
      0.04,
      0.08,
      0.12,
      0.24
      // 0.05,
      // 0.025,
      // 0.075
    ]
  }

  rootSegs = []

  canvas = createCanvas(windowWidth, windowHeight - 40);
  
  frameRate(60)
  background(params.drawing.backgroundColor)
  buffer = createGraphics(width, height)
  
  transformer = new P5Transformer()

  let minDim = min(width, height)
  const rootSegCount = round(random(params.rootSegs.min, params.rootSegs.max))
  for(let i = 0; i < rootSegCount; i++) {

    let length = random(params.length.min * minDim, params.length.max * minDim)
    let startAng = random(params.angle.startMin, params.angle.startMax)

    let rootSeg = new Segment(null, length, startAng);
    let targetDepth = round(random(params.depth.min, params.depth.max))
    
    for(let seg = rootSeg, depth = 1; depth < targetDepth; depth ++) {
      seg = seg.addChild(seg.length, random(TWO_PI), random(params.length.min * minDim, params.length.max * minDim))
    }

    let loc = createVector(0, 0)
    if (rootSegCount > 1) {
      loc = createVector(random(- width / 2, width / 2), random(- height / 2, height / 2))
    }
    
    rootSegs.push({
      loc: loc,
      seg: rootSeg
    })
  }

  
  // createButton("Save with arms").mouseClicked(saveAll)
}

function saveBufferWithBackground(){
  let buf2 = createGraphics(width, height)
  buf2.background(params.drawing.backgroundColor)
  buf2.image(buffer, 0, 0)
  save(buf2, "multidof-art.png")
}
function saveBufferTransparent() {
  save(buffer, "multidof-art-transparent.png")
}
function saveAll(){
  save(canvas, "multidof-arms-art.png")
}

function printLocation(seg: Segment) {
  // console.log(`seg[${seg.id}] at point: (${transformer.x}, ${transformer.y})`)
  
  if (params.drawing.specificDepth !== false && params.drawing.specificDepth !== seg.depth) {
    return
  }

  let ci = (params.color.offset + seg.id) % colors.length;
  let c = colors[ci]

  
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

  if (params.drawLines && seg.pLoc && seg.ppLoc && seg.pppLoc) 
  {
    
    buffer.strokeWeight(params.drawing.lineWeight)
    buffer.noFill()

    buffer.curve(seg.pppLoc.x, seg.pppLoc.y,
                 seg.ppLoc.x,  seg.ppLoc.y,
                 seg.pLoc.x,   seg.pLoc.y,
                 loc.x,        loc.y)

    // buffer.line(seg.pLoc.x, seg.pLoc.y, loc.x, loc.y)
  }
  if (params.drawDots)
  {
    buffer.strokeWeight(params.drawing.pointSize)
    buffer.point(transformer.x, transformer.y);
  }
  
  seg.pppLoc = seg.ppLoc;
  seg.ppLoc = seg.pLoc;
  seg.pLoc = loc

  transformer.pop();
}

function draw() {
  
  transformer.reset()

  background(params.drawing.backgroundColor)

  image(buffer, 0, 0)

  transformer.translate(width / 2, height / 2)
  if (params.length.masterScale !== 1) {
    transformer.scale(params.length.masterScale)
  }

  for(let rootSeg of rootSegs) {

    transformer.push()
    transformer.translate(rootSeg.loc.x, rootSeg.loc.y)
    rootSeg.seg.draw(transformer, printLocation);

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