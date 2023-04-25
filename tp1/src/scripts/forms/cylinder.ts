import type { vec3 } from "gl-matrix";
import { buildBuffers, buildIndex, type Geometry } from "../geometry";
import { DrawMethod, type WebGL } from "../webgl";

export class Cylinder implements Geometry {

    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];

    covers: {
        position: number[], 
        index: number[], 
        normal: number[]
    }[] = [{position: [], index: [], normal: []}];

    rows: number;
    cols: number;
    height: number;
    radius: number;

    constructor(rows: number, cols: number, radius: number, height: number) {
        this.rows = rows;
        this.cols = cols;
        this.radius = radius;
        this.height = height;

        buildBuffers(this);
        buildIndex(this);
        this.buildCovers();
    };

    buildCovers() {
        this.covers.forEach((c) => {

        });
    }

    getNormals(alfa: number, beta: number): vec3 {
        throw new Error("Method not implemented.");
    }

    getPosition(alfa: number, beta: number): vec3 {
        throw new Error("Method not implemented.");
    }

    draw(gl: WebGL): void {
        gl.draw(this.position, this.index, this.normal);
        this.covers.forEach((c) => {
            gl.draw(c.position, c.index, c.normal, DrawMethod.Fan);
        })
    }
    
}