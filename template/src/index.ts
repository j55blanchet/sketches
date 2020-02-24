"use strict";

(async () => {
  const { default: sketch } = await import("./sketch.js");
  console.log(sketch);
  new (<any> window).p5(sketch);
})();
