import Bullet from "./Bullet";
import p5 from "p5";

class AlienBullet extends Bullet {
  x: number;
  y: number;

  constructor(x: number, y: number, p5: p5) {
    super(x, y, p5);
  }

  update(): void {
    this.y += 2;
  }
}

export default AlienBullet
