import Alien, { Image } from "./Alien";
import p5 from "p5";
import AlienBullet from "./AlienBullet";
import Bullet from "./Bullet";
import Player from "./Player";
import { K8sApi } from "@k8slens/extensions";
import { IObservableArray } from "mobx";


class Invaders {

    image: Image;
    direction: number;
    y: number;
    aliens: Array<Alien> = [];
    bullets: Array<Bullet>;
    speed: number;
    timeSinceLastBullet: number;
    p5: p5;
    pods: Array<K8sApi.Pod>;

    constructor(image: Image, p5: p5, pods: IObservableArray<K8sApi.Pod>) {
      this.image = image;
      this.direction = 0;
      this.y = 40;
      this.p5 = p5;
      this.bullets = [];
      this.speed = 0.2;
      this.pods = pods;
      this.createAliens();

      // to make sure the aliens dont spam
      this.timeSinceLastBullet = 0;
    }

    update(player: Player): void {

      this.updateAliens();

      for (const alien of this.aliens) {
        if (this.direction == 0) {
          alien.x += this.speed;
        } else if (this.direction == 1) {
          alien.x -= this.speed;
        }
      }
      this.updateBullets(player);

      if (this.hasChangedDirection()) {
        //this.moveAlienDown();
      }

      if (this.timeSinceLastBullet >= 40) {
        const bottomAliens = this.getBottomAliens();
        if (bottomAliens.length) {
          this.makeABottomAlienShoot(bottomAliens);
        }
      }

      this.timeSinceLastBullet++;

      if (this.aliens.length == 0) {
        this.nextLevel();
      }
    }

    hasChangedDirection(): boolean {
      for (const alien of this.aliens) {
        if (alien.x >= this.p5.width - 40) {
          this.direction = 1;
          return true;
        } else if (alien.x <= 20) {
          this.direction = 0;
          return true;
        }
      }
      return false;
    }

    moveAlienDown(): void {
      for (const alien of this.aliens) {
        alien.y += 10;
      }
    }

    // to make sure only the bottom row will shoot
    getBottomAliens(): Array<Alien> {
      const allXPositions = this.getAllXPositions();

      const aliensAtTheBottom = [];
      for (const alienAtX of allXPositions) {
        let bestYPosition = 0;
        let lowestAlien;
        for (const alien of this.aliens) {
          if (alien.x == alienAtX) {
            if (alien.y > bestYPosition) {
              bestYPosition = alien.y;
              lowestAlien = alien;
            }
          }
        }
        aliensAtTheBottom.push(lowestAlien);
      }
      return aliensAtTheBottom;
    }

    nextLevel(): void {
      this.speed += 0.5;
      this.updateAliens();
    }

    // get all the x positions for a single frame
    getAllXPositions(): Set<unknown> {
      const allXPositions = new Set();
      for (const alien of this.aliens) {
        allXPositions.add(alien.x);
      }
      return allXPositions
    }

    createAliens(): void {
      let y = 80;

      const maxX = this.p5.width - 200;
      const minX = 300;
      const gapX = 50;
      const perRow = Math.ceil((maxX - minX) / gapX);
      const rows = Math.ceil(this.pods.length / perRow);
      const xPos = (index: number): number => minX + (index % perRow)* gapX


      for (let i = 0; i < rows; i++) {
        this.pods.forEach((pod, index) => {
          this.aliens.push(new Alien(xPos(index), y, this.image, this.p5, pod));
        })
        y += 50;
      }
    }

    updateAliens(): void {
      let y = 80;

      const maxX = this.p5.width - 200;
      const minX = 300;
      const gapX = 50;

      const newPods: K8sApi.Pod[] = []
      this.pods.forEach((pod: K8sApi.Pod) => {
        const alien = this.aliens.find((a) => a.pod.getId() === pod.getId())
        if(!alien) {
          newPods.push(pod);
        }
      })

      const podIds = this.pods.map((p) => p.getId());

      this.aliens.forEach((alien, index) => {
        if (!podIds.includes(alien.pod.getId())) {
          this.aliens.splice(index, 1);
        }
      })

      if(newPods.length > 0) {
        let x = minX;
        newPods.forEach((pod) => {
          const lastAlien = this.aliens[this.aliens.length - 1];
          if (lastAlien) {
            x = lastAlien.x + gapX;
            y = lastAlien.y;
            if (x >= maxX) {
              x = minX;
              y = lastAlien.y + gapX;
            }
          }
          this.aliens.push(new Alien(x, y, this.image, this.p5, pod))
        })
      }
    }

    checkCollision(x: number, y: number): boolean {
      for (let i = this.aliens.length - 1; i >= 0; i--) {
        const currentAlien = this.aliens[i];
        // the numbers are hard-coded for the width of the image
        if (this.p5.dist(x, y, currentAlien.x + 15.5, currentAlien.y + 12) < 10) {
          currentAlien.pod.delete();
          return true;
        }
      }
      return false;
    }

    makeABottomAlienShoot(bottomAliens: Array<Alien>): void {
      const shootingAlien = this.p5.random(bottomAliens);
      const bullet = new AlienBullet(shootingAlien.x + 10, shootingAlien.y + 10, this.p5);
      this.bullets.push(bullet);
      this.timeSinceLastBullet = 0;
    }

    updateBullets(player: Player): void {
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        this.bullets[i].y += 2;
        if (this.bullets[i].hasHit(player)) {
          player.lives--;
          this.bullets.splice(i, 1);
        }
      }
    }

    draw(): void {
      for (const alien of this.aliens) {
        alien.draw();
      }
    }
}

export default Invaders
