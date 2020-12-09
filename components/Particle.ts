import p5 from "p5";

// this class describes the properties of a single particle.
class Particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  x: number;
  y: number;
  r: number;
  xSpeed: number;
  ySpeed: number;
  p5: p5;

  constructor(p5: p5) {
    this.p5 = p5;
    this.x = this.p5.random(0, this.p5.windowWidth);
    this.y = this.p5.random(0, this.p5.windowHeight);
    this.r = this.p5.random(1, 8);
    this.xSpeed = this.p5.random(-2, 2);
    this.ySpeed = this.p5.random(-1, 1.5);
  }

  // creation of a particle.
  createParticle(): void {
    this.p5.noStroke();
    this.p5.fill("rgba(200,169,169,0.5)");
    this.p5.circle(this.x, this.y, this.r);
  }

  // setting the particle in motion.
  moveParticle(): void {
    if (this.x < 0 || this.x > this.p5.windowWidth)
      this.xSpeed *= -1;
    if (this.y < 0 || this.y > this.p5.windowHeight)
      this.ySpeed *= -1;
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  // this function creates the connections(lines)
  // between particles which are less than a certain distance apart
  joinParticles(particles: Array<Particle>): void {
    particles.forEach((element: Particle) => {
      const dis = this.p5.dist(this.x, this.y, element.x, element.y);
      if (dis < 85) {
        this.p5.stroke("rgba(255,255,255,0.08)");
        this.p5.line(this.x, this.y, element.x, element.y);
      }
    });
  }
}

export default Particle;
