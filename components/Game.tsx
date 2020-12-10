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
  const greenAlien = p.loadImage("https://i.imgur.com/fqeDYa0.png");
  const redAlien = p.loadImage("https://i.imgur.com/iHKEnRq.png");
  const yellowAlien = p.loadImage("https://i.imgur.com/lVEg9GG.png");
  const orangeAlien = p.loadImage("https://i.imgur.com/LRYWNG0.png");

  let invaders: Invaders;
  let player: Player;
  let enableParticles = false;
  let lastMouseTarget: EventTarget;

  const setup = () => {
    const container = document.getElementById("p5_canvas_container");
    const canvas = p.createCanvas(container.offsetWidth, container.clientHeight + 100);
    canvas.parent(container);
    canvas.style("position", "relative");
    canvas.attribute("tabindex", "1");
    p.frameRate(24);
    invaders = new Invaders({
      greenAlien, yellowAlien, orangeAlien, redAlien
    }, p, pods);
    player = new Player(playerImage, p, invaders);

    document.addEventListener("mousedown", (event) => {
      lastMouseTarget = event.target;
    }, false);


    const bind = ({ code }: { code: string }) => {
      if (lastMouseTarget !== canvas.elt) {
        return;
      }
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

    for (let i = 0; i < p.width / 20; i++) {
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

    if (player.score > (invaders.aliens.length * player.level)) {
      invaders.aliens = [];
      invaders.speed += 0.4;
      player.level += 1;
    }

    if (player.lives == 0) {
      p.textFont("Courier New");
      p.textSize(100);
      p.fill("rgba(0,255,0,1)");
      const container = document.getElementById("p5_canvas_container");
      p.text("GAME OVER ", container.offsetWidth / 2 - 220, container.clientHeight / 2);
      p.fill("rgba(255,255,255,1)");
      p.textSize(20);
      p.text("CMD/Ctrl + R to restart", container.offsetWidth / 2 - 150, container.clientHeight / 2 + 30);
      player.stop();
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
