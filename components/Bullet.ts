import p5 from "p5";
import Player from "./Player";

class Bullet {
  p5: p5;
  x: number;
  y: number;

  constructor(x: number, y: number, p5: p5) {
    this.x = x;
    this.y = y;
    this.p5 = p5;
  }

  isOffScreen(): boolean {
    return this.y <= 0;
  }
    
  draw(): void {
    this.p5.fill(255);
    this.p5.rect(this.x, this.y, 3, 15);
  }

  hasHit(player: Player): boolean {
    return this.p5.dist(this.x, this.y, player.x + 10, player.y + 10) < 20;
  }
}

export default Bullet;
