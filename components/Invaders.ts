import Alien, { Image } from "./Alien";
import p5 from "p5";
import AlienBullet from "./AlienBullet";
import Bullet from "./Bullet";
import Player from "./Player";

class Invaders {
    
    image: Image;
    rowsCount: number;
    direction: number;
    y: number;
    aliens: Array<Alien>;
    bullets: Array<Bullet>;
    speed: number;
    timeSinceLastBullet: number;
    p5: p5;

    constructor(image: Image, p5: p5, rowsCount: number) {
      this.image = image;
      this.rowsCount = rowsCount;
      this.direction = 0;
      this.y = 40;
      this.p5 = p5;
      this.aliens = this.initialiseAliens();
      this.bullets = [];
      this.speed = 0.2;

      // to make sure the aliens dont spam
      this.timeSinceLastBullet = 0;
    }

    update(player: Player): void {

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

      if (this.aliens.length == 0) {
        this.nextLevel();
      }
    }

    hasChangedDirection(): boolean {
      for (const alien of this.aliens) {
        if (alien.x >= this.p5.windowWidth - 40) {
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
      this.aliens = this.initialiseAliens();
    }

    // get all the x positions for a single frame
    getAllXPositions(): Set<unknown> {
      const allXPositions = new Set();
      for (const alien of this.aliens) {
        allXPositions.add(alien.x);
      }
      return allXPositions
    }

    initialiseAliens(): Array<Alien> {
      const aliens = [];
      let y = 80;
      for (let i = 0; i < this.rowsCount; i++) {
        for (let x = 300; x < this.p5.windowWidth - 200; x += 50) {
          aliens.push(new Alien(x, y, this.image, this.p5));
        }
        y += 50;
      }
      return aliens;
    }

    checkCollision(x: number, y: number): boolean {
      for (let i = this.aliens.length - 1; i >= 0; i--) {
        const currentAlien = this.aliens[i];
        // the numbers are hard-coded for the width of the image
        if (this.p5.dist(x, y, currentAlien.x + 15.5, currentAlien.y + 12) < 10) {
          this.aliens.splice(i, 1);
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
