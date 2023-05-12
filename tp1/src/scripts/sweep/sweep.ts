import { mat4, vec3 } from "gl-matrix";
import { buildIndex, Geometry } from "../geometry";
import type { WebGL } from "../webgl";
import type { Curve } from "../curves/curve";


export class SweepSurface implements Geometry {

    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];

    rows: number = 75;
    cols: number = 75;

    sweep: Sweepable;
    useCovers = false;

    constructor(sweep: Sweepable,) {
        this.sweep = sweep;
        this.buildSweepableBuffers();
        buildIndex(this);
    }

    buildSweepableBuffers(): void {
    
        let points: number[] = [];
        let normals: number[] = [];
        let tangents: number[] = [];
    
        let path = this.sweep.discretizePath(1 / this.rows);
        let shape = this.sweep.getShape().discretize(1 / this.cols);
        for (let i = 0; i <= this.rows; i++) {
            let {posM , norM} = levelMatrices(path, i);
            for (let j = 0; j <= this.cols; j++) {
                let p = vec3.transformMat4(vec3.create(), shape.p[j], posM)
                let t = vec3.transformMat4(vec3.create(), shape.t[j], norM)
                let n = vec3.transformMat4(vec3.create(), shape.n[j], norM)
                points.push(...p);
                tangents.push(...t);
                normals.push(...n);
            }
        }

        this.normal = normals;
        this.position = points;
    };

    getPointData(alfa: number, beta: number) {
        throw new Error("Sweep Surface has no need to provide point data, Sweepable is in charge of filling the buffers.");
    }

    draw(gl: WebGL): void {
        console.log(this)
        gl.draw(this.position, this.index, this.normal);
        if (this.useCovers) {
        // TODO: Handle covers and fix weird lighting bug, maybe it goes away after drawing the covers. see cube-demo.
        }
    }
}

export interface Sweepable {
    getShape(): Curve;
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