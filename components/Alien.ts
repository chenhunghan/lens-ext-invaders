import p5 from "p5";

type Image = p5.Image

class Alien {
    
  x: number
  y: number
  image: Image
  p5: p5

  constructor(x: number, y: number, image: Image, p5: p5) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.p5 = p5;
  }

  draw(): void {
    this.p5.image(this.image, this.x, this.y, this.image.width / 20, this.image.height / 20);
  }
}

export { Image }
export default Alien
