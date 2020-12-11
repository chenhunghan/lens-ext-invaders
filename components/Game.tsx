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
  let invaders: Invaders;
  let player: Player;
  let enableParticles = false;
  let lastMouseTarget: EventTarget;
  let started = false;
  const gameImage = p.loadImage("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/11a10a01-ac23-4fea-ad5a-b51f53084159/d5eu5dw-11a48688-3762-4f92-ba46-ebf94abe51b1.png/v1/fill/w_900,h_389,strp/space_invaders_logo__us__by_ringostarr39_d5eu5dw-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD0zODkiLCJwYXRoIjoiXC9mXC8xMWExMGEwMS1hYzIzLTRmZWEtYWQ1YS1iNTFmNTMwODQxNTlcL2Q1ZXU1ZHctMTFhNDg2ODgtMzc2Mi00ZjkyLWJhNDYtZWJmOTRhYmU1MWIxLnBuZyIsIndpZHRoIjoiPD05MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.0wP1LBCQjWzqUQ5czHR2NjUv9iaiB2lUp_y-d9FuX-8");

  const setup = () => {
    const playerImage = p.loadImage("https://i.imgur.com/cCmEvHN.png");
    const greenAlien = p.loadImage("https://i.imgur.com/fqeDYa0.png");
    const redAlien = p.loadImage("https://i.imgur.com/iHKEnRq.png");
    const yellowAlien = p.loadImage("https://i.imgur.com/lVEg9GG.png");
    const orangeAlien = p.loadImage("https://i.imgur.com/LRYWNG0.png");
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
      if (event.target === canvas.elt) {
        started = true;
      }
    }, false);

    const bind = ({ code }: { code: string }) => {
      if (lastMouseTarget !== canvas.elt) {
        return;
      }
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

  const draw = () => {
    p.background(0);

    if (started) {
      invaders.update(player);
      invaders.draw();
      player.update();
      player.draw();
    } else {
      const imageWidth = p.width / 3;
      const imageHeight = p.width / 6;
      const x = p.width / 2;
      const y = p.width / 2;
      const textSize = p.width / 50;
      p.image(gameImage, x - imageWidth / 2, y - imageHeight - textSize * 5, imageWidth, imageHeight);
      p.textSize(textSize);
      p.fill("rgba(0,255,0,1)");
      p.textFont("Courier New");
      p.textAlign(p.CENTER)
      p.text("CLICK TO START", x, y - textSize * 3);
    }

    if (player.score > (invaders.aliens.length * player.level)) {
      invaders.aliens = [];
      invaders.speed += 0.4;
      player.level += 1;
    }

    if (player.lives == 0) {
      p.textFont("Courier New");
      p.textSize(p.width / 20);
      p.fill("rgba(0,255,0,1)");
      const x = p.width / 2;
      const y = p.width / 2.5;
      p.text("GAME OVER ", x, y);
      p.fill("rgba(255,255,255,1)");
      p.textSize(p.width / 80);
      p.text("CMD/Ctrl + R to Restart", x - p.width / 80, y + p.width / 40);
      player.stop();
    }

    if (enableParticles) {
      for (let i = 0; i < particles.length; i++) {
        particles[i].createParticle();
        particles[i].moveParticle();
        particles[i].joinParticles(particles.slice(i));
      }
    }
  }
  p.draw = () => {
    draw();
  };

  window.addEventListener("resize", () => {
    const container = document.getElementById("p5_canvas_container");
    p.resizeCanvas(container.clientWidth, container.clientHeight);
    draw();
  })
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
