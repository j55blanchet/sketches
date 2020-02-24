import * as p5 from "p5/index";

console.log(import.meta);

export default class P5Transformer {
    private stack: number[][] = []
    constructor(
        private p: p5,
        public x: number = 0,
        public y: number = 0,
        public a: number = 0,
        public s: number = 1)
    {
    }

    push() {
        this.p.push();
        return this.stack.push([this.x, this.y, this.a, this.s]);
    }

    pop() {
        this.p.pop();
        let ref = this.stack.pop()
        this.x = ref![0]
        this.y = ref![1]
        this.a = ref![2]
        this.s = ref![3]
    }

    rotate(da: number) {
        this.p.rotate(da);
        return this.a += da;
    };

    scale(ds: number) {
        this.p.scale(ds);
        return this.s *= ds;
    };

    translate(dx: number, dy: number) {
        this.p.translate(dx, dy);
        this.x += this.s * dx * this.p.cos(this.a) - this.s * dy * this.p.sin(this.a);
        return this.y += this.s * dy * this.p.cos(this.a) + this.s * dx * this.p.sin(this.a);
    }

    reset() {
        this.x = 0
        this.y = 0
        this.a = 0
        this.s = 1
        this.stack = []
    }
}