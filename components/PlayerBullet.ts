import Bullet from "./Bullet"
import p5 from "p5";

class PlayerBullet extends Bullet {
  constructor(x: number, y: number, p5: p5) {
    super(x, y, p5);
  }

  update(): void {
    this.y -= 6;
  }
}

export default PlayerBullet;
