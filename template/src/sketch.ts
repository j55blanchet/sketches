/**
 * Project adopted from https://github.com/GoSubRoutine/Ball-in-the-Chamber
 */

import * as p5 from "p5/index";

import Ball from "./ball.js";

console.log(import.meta);

export default function sketch(p: p5) {

  const FILL = p.color(210, 136, 80)
  const OUTLINE = p.color(30)
  const WEIGHT = 5

  let balls: Ball[] = []

  p.setup = function (this: typeof p) {

    this.createCanvas(1000, 1000)

    this.ellipseMode(this.CENTER).rectMode(this.CORNER).colorMode(this.RGB);
    this.stroke(OUTLINE).strokeWeight(WEIGHT);
    this.fill(FILL)

  }.bind(p);

  p.draw = function (this: typeof p) {

    this.background(250);
    
    for(let ball of balls) {
      ball.draw(this)
    }

    if (this.random(100) < 5) {
      balls.push(new Ball(this.random(this.width), this.random(this.height)))
    }

    if (balls.length > 0 && this.random(100) < 5) {
      let i = this.floor(this.random(balls.length))
      balls.splice(i, 1)
    }

  }.bind(p);

  p.mouseClicked = function(this: typeof p) {
    balls.push(new Ball(this.mouseX, this.mouseY))
  }.bind(p);
}
