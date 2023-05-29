import type { Camera } from "src/scripts/cameras/camera";
import type { WebGL } from "src/scripts/webgl";
import { CameraMode } from "./camera";
import type { vec3 } from "gl-matrix";

export class Parameters {

    public gl?: WebGL;
    public drawSurface: boolean = true;
    public drawLines: boolean = true;
    public normalColoring: boolean = false;

    public camera?: Camera;
    public cameraMode: CameraMode = CameraMode.SCENE;


    public boat: any = {
        position: [5,0,0],
        raftColor: [217,33,32]
    }
}