

var rootSeg: Segment

function setup() {
  createCanvas(400, 400);

  rootSeg = new Segment(null, 100, PI / 2);
  
  rootSeg.addChild(100, PI / 3, 70)
         .addChild(70, PI / 2, 50)
         .addChild(50, PI * 0.7, 30)
}

function draw() {
  background(220);

  translate(width / 2, height / 2);
  rootSeg.draw();

  rootSeg.recurse((s: Segment) => {
    s.angle += 0.1;
    s.angle %= 2 * PI;
  });
}