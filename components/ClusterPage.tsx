import React, { useState, useLayoutEffect } from "react"
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


const ClusterPage = (): JSX.Element => {
  const [init, setInit] = useState(false);
  useLayoutEffect(() => {
    if (!init) {
      new p5(sketch, document.getElementById("p5_canvas_container"));
      console.info("👾👾👾👾👾👾👾")
      setInit(true)
    }
  }, [init]);
  return (
    <div id='p5_canvas_container'>
    </div>
  )
}

export default ClusterPage
