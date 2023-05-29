import { Orbital } from "../scripts/cameras/orbital";
import { params } from "./scene";
import { Drone } from "../scripts/cameras/drone";
import type { WebGL } from "../scripts/webgl";


export enum CameraMode {
    SCENE,
    DRONE,
    BOAT
}

var cameraMode: CameraMode = CameraMode.SCENE;

export function initCamera(): void {
    var cameraMode = params.cameraMode;
    params.camera = new Orbital(params.gl!);
    changeCamera(cameraMode);
}

function changeCamera(mode: CameraMode) {

    cameraMode = mode;
    params.cameraMode = mode;
    params.camera?.clean();

    switch (mode) {
        case CameraMode.DRONE:
            params.camera = new Drone(params.gl!, [0, 3, 10]);
            params.gl!.canvas.requestPointerLock();
            break;
        case CameraMode.BOAT:
            params.camera = new Orbital(params.gl!, params.boat.position);
        default:
            params.camera = new Orbital(params.gl!)
            break;
    }
}


document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "1":
        changeCamera(CameraMode.SCENE);
        break;
      case "2":
        changeCamera(CameraMode.DRONE);
        break;
      case "3":
        changeCamera(CameraMode.BOAT);
        break;
    }
});


export function updateCamera(gl: WebGL) {
    if (params.cameraMode != cameraMode) {
        changeCamera(params.cameraMode);
    }
    if (params.cameraMode == CameraMode.BOAT){
        params.camera!.lookAt(params.boat.position);
    }
    params.camera!.update(gl);
}
