
/// <reference path="../node_modules/@types/p5/global.d.ts" />

const SPEED_FACTOR = 0.1

const BRANCH_MIN_DIST = 30
const BRANCH_PROBABILITY = 0.01

const w = 500,
      h = 1000;

var tree;

function setup() {
    createCanvas(w, h)
    colorMode(HSB, 100, 100, 100, 100)

    frameRate(60)


    background(90, 0, 90)
    stroke(0, 0, 0)
    strokeWeight(2)
    
    tree = new Branch(createVector(w / 2, 0), PI / 2)
}


function draw() {

    scale(1, -1, 1)
    translate(0, -h)

    fill(0, 0, 0)
    ellipse(0, 0, 10, 10)

    tree.grow(1)
    tree.draw()
}


class Branch {

    constructor(pos, ang) {

        this.pos = pos
        this.ang = ang
        this.l =  0.1
        this.children = []
        this.lastChild = 0
        this.lastChildAngleSign = random() > 0.5 ? -1 : 1
    }

    grow(percent) {
        const growth = 1 + max(log(this.l), 0)
        this.l += growth * SPEED_FACTOR

        // TODO: grow children
        for(let c of this.children) {
            c.grow()
        }

        if (this.l - this.lastChild > BRANCH_MIN_DIST && random() < BRANCH_PROBABILITY) {
            // Create branch
            let child = new Branch(createVector(this.l, 0), random(PI / 3) * this.lastChildAngleSign)
            this.lastChildAngleSign = -this.lastChildAngleSign
            this.children.push(child)

            this.lastChild = this.l
        }
    }
    
    draw() {
        push()
        
        strokeWeight(max(sqrt(this.l) / 3, 0.1))

        translate(this.pos)
        rotate(this.ang)
 
        // TODO: make the branch decrease in size as it goes higher
        line(0, 0, this.l, 0)

        scale(0.8)

        for(let c of this.children) {
            c.draw()
        }

        pop()
    }   
}