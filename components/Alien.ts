import p5 from "p5";
import { K8sApi } from "@k8slens/extensions";
import { reaction } from "mobx";

type Image = p5.Image

class Alien {

  x: number
  y: number
  image: Image
  p5: p5
  pod: K8sApi.Pod;

  constructor(x: number, y: number, image: Image, p5: p5, pod: K8sApi.Pod) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.p5 = p5;
    this.pod = pod
  }

  draw(): void {
    this.p5.image(this.image, this.x, this.y, this.image.width / 20, this.image.height / 20);
    //this.p5.textSize(8);
    // [...this.pod.metadata.name].forEach((character, i, n) => {
    //   if (i % 7 === 0) {
    //     this.p5.text(`${n[i - 3] ?? ""}${n[i - 2] ?? ""}${n[i - 1] ?? ""}${character}${n[i + 1] ?? ""}${n[i + 2] ?? ""}${n[i + 3] ?? ""}`, this.x, this.y + 40 + (i / 7) * 10);
    //   }
    // })

  }
}

export { Image }
export default Alien
