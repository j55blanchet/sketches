
var rootSeg: Segment

var isLooping = true

function setup() {
  createCanvas(800, 800);
  
  frameRate(30)

  rootSeg = new Segment(null, 70, PI / 2);
  
  rootSeg.addChild(70, PI / 3, 50)
         .addChild(50, PI / 2, 30)
}

function draw() {
  background(240);
  translate(width / 2, height / 2);
  scale(2)
  
  rootSeg.draw();

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