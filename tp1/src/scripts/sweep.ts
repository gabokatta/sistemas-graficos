import { buildBuffers, buildIndex, Geometry } from "./geometry";
import { DrawMethod, WebGL } from "./webgl";
import type { Curve } from "./curves/curve";
import { mat4, vec3 } from "gl-matrix";
import { DEFAULT_DELTA } from "./curves/segment";
import { applyTransform } from "./util";

export class SweepSurface implements Geometry {

    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];

    rows: number = 75;
    cols: number = 75;

    shape: Surface;
    path: Path;
    transform: mat4;

    drawCovers = false;

    constructor(shape: Surface, path: Path) {
        this.shape = shape;
        this.path = path;
        this.transform = mat4.create();
        buildBuffers(this);
        buildIndex(this);
    }

    setTransform(transform: mat4): SweepSurface {
        this.shape.setTransform(transform);
        this.transform = transform;
        return this;
    }

    getPointData(alfa: number, beta: number) {
        let pathPoint = this.path.getPointData(alfa);
        this.shape.applyOrientation(pathPoint);
        return this.shape.shapePoint(beta);
    }

    draw(gl: WebGL): void {
        gl.draw(this.position, this.index, this.normal);
        if (this.drawCovers) {
            let start = this.path.getPointData(0);
            let end = this.path.getPointData(1);
            let startBuf = this.shape.applyOrientation(start).getBuffers(1 / this.cols);
            let endBuf = this.shape.applyOrientation(end).getBuffers(1 / this.cols, true);
            for (let buf of [startBuf, endBuf]) {
                gl.draw(buf.p, buf.idx, buf.n, DrawMethod.Fan);
            }
        }
    }
    
}

export class Surface {

    shape: Curve;
    orientation: any;
    transform: mat4 = mat4.create();

    //Config
    fill = true;
    outline = false;
    system = true;

    constructor(shape: Curve, orientation: any = {p: [0,0,0], t: [0,0,-1], n: [0,1,0]}) {
        this.shape = shape;
        this.orientation = orientation;
    }

    setTransform(transform: mat4): Surface {
        this.shape.setTransform(transform);
        this.transform = transform;
        return this;
    }

    applyOrientation(orientation: any): Surface {
        if (!orientation.b) {
            orientation.b = vec3.cross(vec3.create(), orientation.t, orientation.n);
        }
        return this.setTransform(buildLevelMatrix(orientation));
    }

    getOrientation() {
        let {p, t, n} =  this.orientation;
        let b = [...vec3.cross(vec3.create(), t, n).values()];
        this.orientation.b = b;
        return applyTransform(this.transform, {p , t, n, b});
    }

    shapePoint(u: number) {
        let {p,  n, t, b} = this.shape.getPointData(u);
        return {p, n, t, b};
    }

    draw(gl: WebGL): void {
        let {p: center, t , n, b} = this.getOrientation();

        if (this.outline) this.shape.glDraw(gl);
        if (this.fill) {

            let points = [...center];
            let normals = [...t]

            for (let u = 0; u <= 1.001; u = u + DEFAULT_DELTA) {
                const { p } = this.shape.getPointData(u);
                points.push(...p);
                normals.push(...t);
            }

            let n_points = points.length/3;
            let index = [...Array(n_points).keys()];
            
            gl.draw(points, index, normals, DrawMethod.Fan);
        }
        if (this.system) {
            gl.drawVec(center, t, 2, [1, 0, 0, 1, 0, 0]);
            gl.drawVec(center, n, 2, [0, 1, 0, 0, 1, 0]);
            gl.drawVec(center, b, 2, [0, 0, 1, 0, 0, 1]);
        }

    }

    getBuffers(delta: number = DEFAULT_DELTA, invertNormals: boolean = false): {p: number[], idx: number[], n: number[]} {
        const { p: center, t: _t } = this.getOrientation();
        const t = invertNormals ? vec3.fromValues(-1*_t[0], -1*_t[1], -1*_t[2]) : _t;

        let points = [...center];
        let normals = [...t];

        for (let u = 0; u <= 1.001; u = u + delta) {
            const {  p } = this.shape.getPointData(u);
            points.push(...p);
            normals.push(...t);
        }

        let n_points = points.length/3;
        let index = [...Array(n_points).keys()];

        return {p: points, idx: index, n: normals};
    }
}

function buildLevelMatrix(orientation: any): mat4 {
    let transform = mat4.fromValues(
        orientation.b[0], orientation.b[1], orientation.b[2], 0,
        orientation.n[0], orientation.n[1], orientation.n[2], 0,
        orientation.t[0], orientation.t[1], orientation.t[2], 0,
        orientation.p[0], orientation.p[1], orientation.p[2], 1
    );
    return transform;
}

export interface Path {
    getPointData(u: number): any;
    glDraw(gl: WebGL, delta: number, controlPoints: boolean): void;
}
