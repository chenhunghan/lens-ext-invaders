import { Renderer } from "@k8slens/extensions";

export default class MainExtension extends Renderer.LensExtension {
    
  onActivate(): void {
    console.log("activated");
  }

  onDeactivate(): void {
    console.log("deactivated");
  }

  appMenus = [
    {
      parentId: "help",
      label: "Invade",
      click(): void {
        this.navigate();
      }
    }
  ]
}
