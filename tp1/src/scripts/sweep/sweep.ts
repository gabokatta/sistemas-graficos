import { mat4, vec3 } from "gl-matrix";
import { buildIndex, Geometry } from "../geometry";
import type { WebGL } from "../webgl";
import type { Curve } from "../curves/curve";

// TODO: 
// - IMPLEMENT SHADER HANDLER.
// - DRAW NORMALS FOR AND OBJECT AND CHECK CORRECT FUNCTIONALITY.
// - FIX GODDAMN SWEEP.

// Weird visual bug when levels do not match cols.
// Implement covers.

export class SweepSurface implements Geometry {

    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];

    rows: number = 75;
    cols: number = 75;
    levels: number;

    sweep: Sweepable;

    constructor(sweep: Sweepable, levels: number = -1) {
        this.sweep = sweep;
        this.levels = levels <= -1 ? this.rows : levels;
        this.buildSweepableBuffers();
        buildIndex(this);
    }

    buildSweepableBuffers(): void {
        let points: number[] = [];
        let normals: number[] = [];
        let tangents: number[] = [];
        for (let i = 0; i <= this.levels; i++) {
            for (let j = 0; j <= this.cols; j++) {
                let {p, t, n} = this.getPointData(i,j);
                points.push(...p);
                tangents.push(...t);
                normals.push(...n);
            }
        }
        this.normal = normals;
        this.position = points;
    };

    getPointData(alfa: number, beta: number): any {
        let path = this.sweep.discretizePath(1 / (this.levels));
        let shape = this.sweep.getShape().discretize(1 / this.cols);
        let {posM , norM} = levelMatrices(path, alfa);
        let p = vec3.transformMat4(vec3.create(), shape.p[beta], posM)
        let t = vec3.transformMat4(vec3.create(), shape.t[beta], norM)
        let n = vec3.transformMat4(vec3.create(), shape.n[beta], norM)
        return {p, t, n}
    }

    draw(gl: WebGL): void {
        gl.draw(this.position, this.index, this.normal);
    }

}

export interface Sweepable {
    getShape(): Curve;
    getPath(): Curve;
    discretizePath(delta: number): any;
}

export function levelMatrices(data: any, index: number): {posM: mat4, norM: mat4} {
    return {
        posM:positionMatrix(data.n[index], data.b[index], data.t[index], data.p[index]), 
        norM:normalMatrix(data.n[index], data.b[index], data.t[index], data.p[index])
    };
}

function positionMatrix(n: vec3, b: vec3, t: vec3, p: vec3): mat4 {
    return mat4.fromValues(
        n[0], n[1], n[2], 0,
        b[0], b[1], b[2], 0,
        t[0], t[1], t[2], 0,
        p[0], p[1], p[2], 1,
    )
}

function normalMatrix(n: vec3, b: vec3, t: vec3, p: vec3): mat4 {
    return mat4.fromValues(
        n[0], n[1], n[2], 0,
        b[0], b[1], b[2], 0,
        t[0], t[1], t[2], 0,
        0, 0, 0, 0,
    )
}