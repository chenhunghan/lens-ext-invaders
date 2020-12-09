import React, { memo, useState, useLayoutEffect, useEffect } from "react"
import { K8sApi } from "@k8slens/extensions";
import p5 from "p5";
import Invaders from "./Invaders";
import Player from "./Player";
type Props = { pods: Array<K8sApi.Pod> }

const sketch = (pods: Array<K8sApi.Pod>) => (p: p5) => {
  
  const playerImage = p.loadImage("https://i.imgur.com/cCmEvHN.png");
  const alienImage = p.loadImage("https://i.imgur.com/fqeDYa0.png");

  let invaders: Invaders;
  let player: Player;
  
  const setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(24);
    invaders = new Invaders(alienImage, p, pods.length);
    player = new Player(playerImage, p, invaders);
  }

  p.setup = () => {
    setup();
  };

  p.draw = () => {
    p.background(0);
    
    invaders.update(player);
    invaders.draw();

    player.update();
    player.draw();

    if (player.lives == 0) {
      setup();
    }
  };
};

const Game = memo(({ pods }: Props): JSX.Element => {
  
  const [init, setInit] = useState(false);
  useLayoutEffect(() => {
    if (!init) {
      new p5(sketch(pods), document.getElementById("p5_canvas_container"));
      console.info("👾 P5 Canvas Injected");
      setInit(true)
    }
  }, [init, pods]);

  return (
    <div className="flex column gaps align-flex-start">
      <div id='p5_canvas_container' />
    </div>
  )
})

export default Game
