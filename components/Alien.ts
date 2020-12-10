import p5 from "p5";
import { K8sApi } from "@k8slens/extensions";
import { AlienImages } from "./Invaders";

class Alien {

  x: number
  y: number
  alienImages: AlienImages
  p5: p5
  pod: K8sApi.Pod;
  hits: number;

  constructor(x: number, y: number, alienImages: AlienImages, p5: p5, pod: K8sApi.Pod) {
    this.x = x;
    this.y = y;
    this.alienImages = alienImages;
    this.p5 = p5;
    this.pod = pod
    this.hits = 0;
  }

  bulletHit(): number {
    this.pod.delete();
    return this.hits += 1;
  }

  draw(): void {
    let image: p5.Image;
    this.p5.textSize(8);

    const status = this.pod.getStatus();
    if (this.pod.metadata.deletionTimestamp || this.hits > 0) {
      image = this.alienImages.redAlien;
    } else if (status === "Running") {
      image = this.alienImages.greenAlien;
    } else if (status === "Pending") {
      image = this.alienImages.yellowAlien
    } else {
      image = this.alienImages.orangeAlien
    }
    image && this.p5.image(image, this.x, this.y, image.width / 20, image.height / 20);

    const name = this.pod.getName();
    if (name && name.length > 7) {
      this.p5.text(`${name.substring(0, 7)}..`, this.x, this.y + 40);
    } else {
      this.p5.text(`${name}`, this.x, this.y + 40);
    }
  }
}

export default Alien
