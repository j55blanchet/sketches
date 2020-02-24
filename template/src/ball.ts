import * as p5 from "p5/index";

console.log(import.meta);

export default class Ball {

    constructor(public x: number, public y: number) {
    }

    draw(p: p5) {
        p.ellipse(this.x, this.y, 20, 20)
    }
}