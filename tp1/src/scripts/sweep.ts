import type { vec3 } from "gl-matrix";
import { buildBuffers, buildIndex, Geometry } from "./geometry";
import type { WebGL } from "./webgl";
import type { Curve } from "./curves/curve";
export class SweepSurface implements Geometry {

    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];

    rows: number = 75;
    cols: number = 75;

    shape: Curve;
    path: Curve;


    constructor(shape: Curve, path: Curve) {
        this.shape = shape;
        this.path = path;
        buildBuffers(this);
        buildIndex(this);
    }

    getPointData(alfa: number, beta: number) {
        throw new Error("Method not implemented.");
    }

    draw(gl: WebGL): void {
        throw new Error("Method not implemented.");
    }
    
}