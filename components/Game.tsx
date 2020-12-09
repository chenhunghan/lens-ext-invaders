import React, { memo, useState, useLayoutEffect } from "react"
import { K8sApi, Component } from "@k8slens/extensions";
import p5 from "p5";
import Invaders from "./Invaders";
import Player from "./Player";
import { IObservableArray } from "mobx";
import Particle from "./Particle";

type Props = { pods: IObservableArray<K8sApi.Pod> }

let keyboardEvenListener: (ev: KeyboardEvent) => void

// an array to add multiple particles
const particles: Array<Particle> = [];

const sketch = (pods: IObservableArray<K8sApi.Pod>) => (p: p5) => {

  const playerImage = p.loadImage("https://i.imgur.com/cCmEvHN.png");
  const alienImage = p.loadImage("https://i.imgur.com/fqeDYa0.png");

  let invaders: Invaders;
  let player: Player;

  let enableParticles = false;



  const setup = () => {
    const container = document.getElementById("p5_canvas_container");
    const canvas = p.createCanvas(container.offsetWidth, container.clientHeight);
    canvas.parent(container);
    canvas.style("position", "relative");
    p.frameRate(24);
    invaders = new Invaders(alienImage, p, pods);
    player = new Player(playerImage, p, invaders);

    const bind = ({ code }: { code: string }) => {
      console.info("code", code)
      switch (code) {
      case "ArrowRight":
        player.moveRight()
        break;
      case "ArrowLeft":
        player.moveLeft()
        break;
      case "Space":
        console.info("🔫🔫🔫 You humans!")
        player.shoot()
        break;
      case "KeyS":
        enableParticles = !enableParticles;
        console.info("enableParticles", enableParticles)
        break;
      default:
        break;
      }
    };

    document.addEventListener("keydown", bind);
    keyboardEvenListener = bind;

    for (let i = 0; i < p.windowWidth / 10; i++) {
      particles.push(new Particle(p));
    }
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

    if (enableParticles) {
      for (let i = 0; i < particles.length; i++) {
        particles[i].createParticle();
        particles[i].moveParticle();
        particles[i].joinParticles(particles.slice(i));
      }
    }
  };
};

const Game = memo(({ pods }: Props): JSX.Element => {

  const [init, setInit] = useState(false);
  useLayoutEffect(() => {
    if (!init) {
      keyboardEvenListener && document.removeEventListener("keydown", keyboardEvenListener)
      new p5(sketch(pods));
      console.info("👾 P5 Canvas Injected");
      setInit(true)
    }
  }, [init, pods]);


  return (
    <div id='p5_canvas_container' className="flex box column grow"></div>
  )
})

export default Game
