import { mat4, vec3 } from "gl-matrix";
import { buildIndex, Geometry } from "../geometry";
import { DrawMethod, WebGL } from "../webgl";
import type { Curve } from "../curves/curve";

export class SweepSurface implements Geometry {

    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];

    rows: number = 75;
    cols: number = 75;
    levels: number;

    useCovers: boolean = true;
    covers: any = undefined;

    sweep: Sweepable;
    discretizedPath: any;
    discretizedShape: any;

    constructor(sweep: Sweepable, levels: number = -1) {
        this.levels = levels <= -1 ? this.rows : levels;
        this.sweep = sweep;
        this.discretizedPath = this.sweep.discretizePath(1 / (this.levels));
        this.discretizedShape = this.sweep.getShape().discretize(1 / (this.cols));
        this.buildSweepableBuffers();
        buildIndex(this);
    }

    getCovers() {
        if (this.covers) {
            return this.covers;
        }
        this.covers = {top: this.topCover(), bottom: this.bottomCover(true)};
        console.log("top", this.covers.top)
        console.log("bottom", this.covers.bottom)
        return this.covers;
    }

    topCover(invertNormals: boolean = false): {p: number[], n: number[], idx: number[]} {
        let cover: {p: number[], n: number[], idx: number[]} = {p: [], n: [], idx: []};

        let center = this.sweep.getPath().getPointData(1);
        cover.p.push(...center.p);
        cover.n.push(...(invertNormals == true ? negateVec(center.t) : center.t));

        let shape = this.discretizedShape;

        for (let i = 0; i < shape.p.length; i++) {
            let point = this.getPointData(this.levels, i);
            cover.p.push(...point.p);
            cover.n.push(...(invertNormals == true ? negateVec(point.t) : point.t))
        }

        let n_points = cover.p.length / 3;
        cover.idx.push(...Array(n_points).keys());

        return {p: cover.p,  n: cover.n, idx: cover.idx}
    }

    bottomCover(invertNormals: boolean = false): {p: number[], n: number[], idx: number[]} {
        let cover: {p: number[], n: number[], idx: number[]} = {p: [], n: [], idx: []};

        let center = this.sweep.getPath().getPointData(0);
        cover.p.push(...center.p);
        cover.n.push(...(invertNormals == true ? negateVec(center.t) : center.t));

        let shape = this.discretizedShape;

        for (let i = 0; i < shape.p.length; i++) {
            let point = this.getPointData(0, i);
            cover.p.push(...point.p);
            cover.n.push(...(invertNormals == true ? negateVec(point.t) : point.t))
        }

        let n_points = cover.p.length / 3;
        cover.idx.push(...Array(n_points).keys());

        return {p: cover.p,  n: cover.n, idx: cover.idx}
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
        let path = this.discretizedPath;
        let shape = this.discretizedShape;
        let {posM , norM} = levelMatrices(path, alfa);
        let p = vec3.transformMat4(vec3.create(), shape.p[beta], posM)
        let t = vec3.transformMat4(vec3.create(), shape.t[beta], norM)
        let n = vec3.transformMat4(vec3.create(), shape.n[beta], norM)
        return {p, t, n}
    }

    draw(gl: WebGL): void {
        gl.draw(this.position, this.index, this.normal);
        if (this.useCovers) {
            let covers = this.getCovers();
            [covers.top, covers.bottom].forEach((c) => {
                gl.draw(c.p, c.idx, c.n, DrawMethod.Fan);
            })
        }
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

function negateVec(vec: vec3): vec3 {
    return vec3.negate(vec3.create(), vec);
}