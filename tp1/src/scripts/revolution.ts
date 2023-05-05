import type { Curve } from "./curves/curve";
import { buildBuffers, buildIndex, Geometry } from "./geometry";
import type { WebGL } from "./webgl";

export class RevolutionSurface implements Geometry {
    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];

    rows: number = 75;
    cols: number = 75;

    shape: Curve;

    constructor(shape: Curve) {
        this.shape = shape;
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