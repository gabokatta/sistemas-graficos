import type { Camera } from "../scripts/cameras/camera";
import type { WebGL } from "../scripts/webgl";
import { CameraMode } from "./camera";

export class Parameters {

    public gl?: WebGL;
    public drawSurface: boolean = true;
    public drawLines: boolean = true;
    public normalColoring: boolean = false;

    public camera?: Camera;
    public cameraMode: CameraMode = CameraMode.SCENE;


    public boat: any = {
        position: [50,4.2,0],
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

    public bridgeLenght: number = 400;
    public towerOffset: number = (this.bridgeLenght / 8)
    public ropesOffset: number = (this.bridgeLenght / 5)
    public bridge: any = {
        values: {
            length: this.bridgeLenght,
            h1: 25, // (5 - 25)
            h2: 60, // (50, 80)
            s1: 8,  // (10, 15)
            position: [0,0,-200]
        },
        road: {
            color: [211/255,211/255,211/255],
            position: [0,10,0]
        },
        towers: {
            positions: [
                [-0.5,0, (this.bridgeLenght/2) - this.towerOffset],
                [-0.5,0, (this.bridgeLenght/2) + this.towerOffset],
                [-27.5,0,(this.bridgeLenght/2) - this.towerOffset],
                [-27.5,0,(this.bridgeLenght/2) + this.towerOffset],
            ],
            color: [217/255,33/255,32/255]
        },
        ropeColor: [217/255,33/255,32/255],
        tensorColor: [255/255,255/255,255/255]
    }

    public terrain: any = {
        water: {
            color: [102/255, 178/255, 255/255],
            level: -50
        },
        grass: {
            color: [0/255, 204/255, 0/255]
        },
        sand: {
            color: [204/255, 204/255, 0/255]
        }
    }
}