import React, { memo } from "react"
import p5 from "p5";

const sketch = (p: p5) => {
  const x = 300;
  const y = 300;
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(30);
  };

  p.draw = () => {
    p.background(0);
    p.fill(255);
    p.rect(x, y, 50, 50);
  };
};


const Game = memo((): JSX.Element => {
  new p5(sketch, document.getElementById("p5_canvas_container"));
  console.info("👾 P5 Canvas Injected")
  return (
    <div id='p5_canvas_container'>
    </div>
  )
})

export default Game
