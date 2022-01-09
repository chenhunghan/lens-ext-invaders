import Alien from "./Alien";
import p5 from "p5";
import AlienBullet from "./AlienBullet";
import Bullet from "./Bullet";
import Player from "./Player";
import { Renderer } from "@k8slens/extensions";
import { IObservableArray } from "mobx";
import { KubeObjectMetadata } from "@k8slens/extensions/dist/src/common/k8s-api/kube-object";

type AlienImages = {
  greenAlien: p5.Image, yellowAlien: p5.Image, orangeAlien: p5.Image, redAlien: p5.Image
}

class Invaders {

    alienImages: AlienImages;
    direction: number;
    y: number;
    aliens: Array<Alien> = [];
    bullets: Array<Bullet>;
    speed: number;
    timeSinceLastBullet: number;
    p5: p5;
    pods: Array<Renderer.K8sApi.KubeObject<KubeObjectMetadata, any, any>>;

    constructor(alienImages: AlienImages, p5: p5, pods: IObservableArray<Renderer.K8sApi.KubeObject<KubeObjectMetadata, any, any>>) {
      this.alienImages = alienImages;
      this.direction = 0;
      this.y = 40;
      this.p5 = p5;
      this.bullets = [];
      this.speed = 0.2;
      this.pods = pods;

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
        this.moveAlienDown();
      }

      if (this.timeSinceLastBullet >= 40) {
        const bottomAliens = this.getBottomAliens();
        if (bottomAliens.length) {
          this.makeABottomAlienShoot(bottomAliens);
        }
      }

      this.timeSinceLastBullet++;
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

    updateAliens(): void {
      const maxX = this.p5.width - 100;
      const minX = 100;
      const gapX = 50;

      const newPods: Renderer.K8sApi.Pod[] = []
      this.pods.forEach((pod: Renderer.K8sApi.Pod) => {
        const alien = this.aliens.find((a) => a.pod.getId() === pod.getId())
        if(!alien) {
          newPods.push(pod);
        } else {
          alien.pod = pod;
        }
      })

      const podIds = this.pods.map((p) => p.getId());
      this.aliens.forEach((alien, index) => {
        if (!podIds.includes(alien.pod.getId())) {
          this.aliens.splice(index, 1);
        }
      })

      const empty = this.aliens.length === 0;
      newPods.sort(() => Math.random() - 0.5);
      if (empty) {
        newPods.forEach((pod) => {
          let y = 80;
          let x = minX;
          const lastAlien = this.aliens[this.aliens.length - 1];
          if (lastAlien) {
            x = lastAlien.x + gapX;
            y = lastAlien.y;
            if (x >= maxX) {
              x = minX;
              y = lastAlien.y + gapX;
            }
          }
          if (this.aliens.length < 100) {
            this.aliens.push(new Alien(x, y, this.alienImages, this.p5, pod))
          }
        })
      } else {
        const pod = newPods[0]
        if (!pod) {
          return
        }
        const alien = this.aliens[Math.floor(Math.random() * this.aliens.length)];
        const aliensOnSameRow = this.aliens.filter((a) => a.y === alien.y)
        if (!aliensOnSameRow.find((a) => a.x >= (alien.x - (gapX + 3)) && a.x < alien.x && (alien.x - gapX) > minX)) {
          if (alien.x - gapX > minX) {
            this.aliens.push(new Alien(alien.x - gapX, alien.y, this.alienImages, this.p5, pod))
          }
        }
      }
    }

    checkCollision(x: number, y: number): boolean {
      for (let i = this.aliens.length - 1; i >= 0; i--) {
        const currentAlien = this.aliens[i];
        // the numbers are hard-coded for the width of the image
        if (this.p5.dist(x, y, currentAlien.x + (currentAlien.width / 2), currentAlien.y + (currentAlien.height / 2)) < currentAlien.width / 2) {
          currentAlien.bulletHit();
          return true;
        }
      }
      return false;
    }

    makeABottomAlienShoot(bottomAliens: Array<Alien>): void {
      const shootingAlien = this.p5.random(bottomAliens.filter((a) => a.hits === 0));
      const bullet = new AlienBullet(shootingAlien.x + 10, shootingAlien.y + 10, this.p5);
      this.bullets.push(bullet);
      this.timeSinceLastBullet = 0;
    }

    updateBullets(player: Player): void {
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        this.bullets[i].y += 4;
        if (this.bullets[i].hasHit(player)) {
          player.bulletHit();
          this.bullets.splice(i, 1);
        }
      }
    }

    draw(): void {
      for (const alien of this.aliens) {
        alien.draw();
      }
      for (const bullet of this.bullets) {
        this.p5.rect(bullet.x, bullet.y, 3, 10);
      }
    }
}

export { AlienImages }
export default Invaders
