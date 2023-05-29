import {CameraMode} from "./camera.js";
export class Parameters {
  constructor() {
    this.drawSurface = true;
    this.drawLines = true;
    this.normalColoring = false;
    this.cameraMode = CameraMode.SCENE;
    this.boat = {
      position: [5, 0, 0],
      raftColor: [217, 33, 32]
    };
  }
}
