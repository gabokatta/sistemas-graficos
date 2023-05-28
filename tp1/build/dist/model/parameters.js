import {CameraMode} from "./camera.js";
export class Parameters {
  constructor() {
    this.drawSurface = true;
    this.drawLines = true;
    this.normalColoring = false;
    this.cameraMode = CameraMode.SCENE;
    this.boatPosition = [5, 0, 0];
  }
}
