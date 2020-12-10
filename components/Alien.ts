import p5 from "p5";
import { K8sApi } from "@k8slens/extensions";
import { AlienImages } from "./Invaders";


class Alien {

  x: number
  y: number
  alienImages: AlienImages
  p5: p5
  pod: K8sApi.Pod;

  constructor(x: number, y: number, alienImages: AlienImages, p5: p5, pod: K8sApi.Pod) {
    this.x = x;
    this.y = y;
    this.alienImages = alienImages;
    this.p5 = p5;
    this.pod = pod
  }

  draw(): void {
    let image: p5.Image;
    this.p5.textSize(8);

    if (
      this.pod.status.containerStatuses &&
      this.pod.status.containerStatuses[0] && 
      this.pod.status.containerStatuses[0].state
    ) {
      const states = this.pod.status.containerStatuses[0].state;
      
      if ("running" in states) {
        image = this.alienImages.greenAlien
      }
      if ("waiting" in states) {
        image = this.alienImages.yellowAlien
      }
      if ("terminated" in states) {
        image = this.alienImages.redAlien
      }
      for (const state in states) {
        this.p5.text(state, this.x, this.y + 50);
      }
      const conditions = this.pod.status.conditions
      this.p5.textSize(6);
      this.p5.text(conditions[conditions.length - 1].type, this.x - 5, this.y + 60)
      this.p5.textSize(8);
    } else if (this.pod.status.phase && this.pod.status.phase === "Pending") {
      // there could condition that this.pod.status.containerStatuses is undefined and
      // this.pod.status.phase === "Pending"
      image = this.alienImages.orangeAlien
      this.p5.textSize(6);
      this.p5.text(this.pod.status.phase, this.x - 5, this.y + 70)
      this.p5.textSize(8);
    }

    image && this.p5.image(image, this.x, this.y, image.width / 20, image.height / 20);

    if (
      this.pod.spec.containers &&
      this.pod.spec.containers[0]
    ) {
      const name = this.pod.spec.containers[0].name
      if (name && name.length > 7) {
        this.p5.text(`${name.substring(0, 7)}..`, this.x, this.y + 40);
      } else {
        this.p5.text(`${name}`, this.x, this.y + 40);
      }
    }
  }
}

export default Alien
