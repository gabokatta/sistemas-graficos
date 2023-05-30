import type { Camera } from "src/scripts/cameras/camera";
import type { WebGL } from "src/scripts/webgl";
import { CameraMode } from "./camera";

export class Parameters {

    public gl?: WebGL;
    public drawSurface: boolean = true;
    public drawLines: boolean = true;
    public normalColoring: boolean = false;

    public camera?: Camera;
    public cameraMode: CameraMode = CameraMode.SCENE;


    public boat: any = {
        position: [4,0,0],
        raftColor: [217/255,33/255,32/255],
        spoilerColor: [1,1,1],
        boxPositions: [
            [-18,-5,-5.15 - 0.3],
            [-15.75,-5,-5.15 - 0.3],
            [-13.45,-5,-5.15 - 0.3],
            [-18,-5,-3 - 0.3],
            [-15.75,-5,-3 - 0.3],
            [-13.45,-5,-3 - 0.3],
            [-11.15,-5,-3 - 0.3],
            [-8.85,-5,-3 - 0.3],
            [-18,-5,-0.75 - 0.3],
            [-15.75,-5,-0.75 - 0.3],
            [-13.45,-5,-0.75 - 0.3],
            [-11.15,-5,-0.75 - 0.3],
            [-8.85,-5,-0.75 - 0.3],
        ],
        boxColors: [
            [217/255,33/255,32/255],
            [100/255,216/255,107/255],
            [225/255,174/255,20/255],
            [225/255,174/255,20/255],
            [50/255,106/255,181/255],
            [217/255,33/255,32/255],
            [71/255,71/255,71/255],
            [217/255,33/255,32/255],
            [71/255,71/255,71/255],
            [71/255,71/255,71/255],
            [100/255,216/255,107/255],
            [217/255,33/255,32/255],
            [50/255,106/255,181/255]
        ]
    }

    public tree: any = {
        leafColor: [143/255,206/255,0/255],
        trunkColor: [139/255,69/255,19/255]
    }

    public bridge: any = {
        roadColor: [211/255,211/255,211/255],
        towerColor: [],
        ropeColor: [],
        tensorColor: []
    }
}