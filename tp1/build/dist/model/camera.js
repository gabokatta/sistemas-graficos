import {Orbital} from "../scripts/cameras/orbital.js";
import {params} from "./scene.js";
import {Drone} from "../scripts/cameras/drone.js";
export var CameraMode;
(function(CameraMode2) {
  CameraMode2[CameraMode2["SCENE"] = 0] = "SCENE";
  CameraMode2[CameraMode2["DRONE"] = 1] = "DRONE";
  CameraMode2[CameraMode2["BOAT"] = 2] = "BOAT";
})(CameraMode || (CameraMode = {}));
var cameraMode = 0;
export function initCamera() {
  var cameraMode2 = params.cameraMode;
  params.camera = new Orbital(params.gl);
  changeCamera(cameraMode2);
}
function changeCamera(mode) {
  cameraMode = mode;
  params.cameraMode = mode;
  params.camera?.clean();
  switch (mode) {
    case 1:
      params.camera = new Drone(params.gl, [0, 3, 10]);
      params.gl.canvas.requestPointerLock();
      break;
    case 2:
      params.camera = new Orbital(params.gl, params.boatPosition);
    default:
      params.camera = new Orbital(params.gl);
      break;
  }
}
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "1":
      changeCamera(0);
      break;
    case "2":
      changeCamera(1);
      break;
    case "3":
      changeCamera(2);
      break;
  }
});
export function updateCamera(gl) {
  if (params.cameraMode != cameraMode) {
    changeCamera(params.cameraMode);
  }
  if (params.cameraMode == 2) {
    params.camera.lookAt(params.boatPosition);
  }
  params.camera.update(gl);
}
