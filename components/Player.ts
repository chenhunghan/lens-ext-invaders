import p5 from "p5";
import { Image } from "./Alien";
import PlayerBullet from "./PlayerBullet"
import Invaders from "./Invaders";

class Player {
  image: Image;
  x: number;
  y: number;
  isMovingLeft: boolean;
  isMovingRight: boolean;
  bullets: Array<PlayerBullet>;
  p5: p5;
  invaders: Invaders;
  lives: number;
  score: number;
  
  constructor(shooterImage: Image, p5: p5, invaders: Invaders) {
    this.image = shooterImage;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.bullets = [];
    this.p5 = p5;
    this.x = this.p5.windowWidth / 2;
    this.y = this.p5.windowHeight - 30;
    this.invaders = invaders;
    this.lives = 3;
    this.score = 0;
  }

  update(): void {
    if (this.isMovingRight) {
      this.x += 1;
    } else if (this.isMovingLeft) {
      this.x -= 1;
    }
    this.constrain();
    this.updateBullets();
  }

  updateBullets(): void {

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update();
      if (this.hasHitAlien(this.bullets[i])) {
        this.bullets.splice(i, 1);
        break;
      } else if (this.bullets[i].isOffScreen()) {
        this.bullets.splice(i, 1);
        break;
      }
    }
  }

  hasHitAlien(bullet: PlayerBullet): boolean {
    return this.invaders.checkCollision(bullet.x, bullet.y);
  }

  constrain(): void {
    if (this.x <= 0) {
      this.x = 0;
    } else if (this.x > this.p5.windowWidth - 23) {
      this.x = this.p5.windowWidth - 23;
    }
  }

  draw(): void {
    this.p5.image(this.image, this.x, this.y, this.image.width / 20, this.image.height / 20);
    this.drawBullets();
  }

  drawBullets(): void {
    for (const bullet of this.bullets) {
      bullet.draw();
    }
  }

  drawLives(): void {
    this.p5.fill(255);
    this.p5.textSize(15);
    this.p5.text("LIVES", 250, 25);
    for (let i = 0; i < this.lives; i++) {
      this.p5.image(this.image, 300 + i * 30, 10, this.image.width / 20, this.image.height / 20);
    }
  }

  drawScore(): void {
    this.p5.text("SCORE", 50, 25);
    this.p5.push();
    this.p5.fill(100, 255, 100);
    this.p5.text(this.score, 110, 25);
    this.p5.pop();
  }

  moveLeft(): void {
    this.isMovingRight = false;
    this.isMovingLeft = true;
  }
  moveRight(): void {
    this.isMovingLeft = false;
    this.isMovingRight = true;
  }
  shoot(): void {
    this.bullets.push(new PlayerBullet(this.x + 12, this.y, this.p5));
  }
}

export default Player;
