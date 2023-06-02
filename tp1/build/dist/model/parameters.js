import {CameraMode} from "./camera.js";
export class Parameters {
  constructor() {
    this.drawSurface = true;
    this.drawLines = true;
    this.normalColoring = false;
    this.cameraMode = CameraMode.SCENE;
    this.boat = {
      position: [50, 4.2, 0],
      raftColor: [217 / 255, 33 / 255, 32 / 255],
      spoilerColor: [1, 1, 1],
      boxPositions: [
        [-18, -5, -5.15 - 0.3],
        [-15.75, -5, -5.15 - 0.3],
        [-13.45, -5, -5.15 - 0.3],
        [-18, -5, -3 - 0.3],
        [-15.75, -5, -3 - 0.3],
        [-13.45, -5, -3 - 0.3],
        [-11.15, -5, -3 - 0.3],
        [-8.85, -5, -3 - 0.3],
        [-18, -5, -0.75 - 0.3],
        [-15.75, -5, -0.75 - 0.3],
        [-13.45, -5, -0.75 - 0.3],
        [-11.15, -5, -0.75 - 0.3],
        [-8.85, -5, -0.75 - 0.3]
      ],
      boxColors: [
        [217 / 255, 33 / 255, 32 / 255],
        [100 / 255, 216 / 255, 107 / 255],
        [225 / 255, 174 / 255, 20 / 255],
        [225 / 255, 174 / 255, 20 / 255],
        [50 / 255, 106 / 255, 181 / 255],
        [217 / 255, 33 / 255, 32 / 255],
        [71 / 255, 71 / 255, 71 / 255],
        [217 / 255, 33 / 255, 32 / 255],
        [71 / 255, 71 / 255, 71 / 255],
        [71 / 255, 71 / 255, 71 / 255],
        [100 / 255, 216 / 255, 107 / 255],
        [217 / 255, 33 / 255, 32 / 255],
        [50 / 255, 106 / 255, 181 / 255]
      ]
    };
    this.tree = {
      leafColor: [143 / 255, 206 / 255, 0 / 255],
      trunkColor: [139 / 255, 69 / 255, 19 / 255]
    };
    this.bridgeLenght = 400;
    this.towerOffset = this.bridgeLenght / 8;
    this.ropesOffset = this.bridgeLenght / 5;
    this.bridge = {
      values: {
        length: this.bridgeLenght,
        h1: 25,
        h2: 60,
        s1: 8,
        position: [0, 0, -200]
      },
      road: {
        color: [211 / 255, 211 / 255, 211 / 255],
        position: [0, 10, 0]
      },
      towers: {
        positions: [
          [-0.5, 0, this.bridgeLenght / 2 - this.towerOffset],
          [-0.5, 0, this.bridgeLenght / 2 + this.towerOffset],
          [-27.5, 0, this.bridgeLenght / 2 - this.towerOffset],
          [-27.5, 0, this.bridgeLenght / 2 + this.towerOffset]
        ],
        color: [217 / 255, 33 / 255, 32 / 255]
      },
      ropeColor: [217 / 255, 33 / 255, 32 / 255],
      tensorColor: [255 / 255, 255 / 255, 255 / 255]
    };
    this.terrain = {
      water: {
        color: [102 / 255, 178 / 255, 255 / 255],
        level: -50
      },
      grass: {
        color: [0 / 255, 204 / 255, 0 / 255]
      },
      sand: {
        color: [204 / 255, 204 / 255, 0 / 255]
      }
    };
  }
}
