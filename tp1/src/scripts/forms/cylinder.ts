import { vec3 } from "gl-matrix";
import { buildBuffers, buildIndex, Geometry } from "../geometry";
import { DrawMethod, WebGL } from "../webgl";

export class Cylinder implements Geometry {

    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];

    covers: {
        position: number[], 
        index: number[], 
        normal: number[]
    }[] = [];

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
        this.covers.push(fillTop(this), fillBottom(this));
    }
    
    getNormals(alfa: number, beta: number): vec3 {
        const x = Math.cos(beta * 2 * Math.PI);
        const y = Math.sin(beta * 2 * Math.PI);
        const z = 0;
      
        return vec3.normalize(vec3.create(), vec3.fromValues(x, y, z));
    }

    getPosition(alfa: number, beta: number): vec3 {
        const x = this.radius * Math.cos(2 * Math.PI * beta);
        const y = this.height * alfa - this.height / 2;
        const z = this.radius * Math.sin(2 * Math.PI * beta);
        return vec3.fromValues(x, y, z);
    }

    draw(gl: WebGL): void {
        gl.draw(this.position, this.index, this.normal);
        this.covers.forEach((c) => {
            gl.draw(c.position, c.index, c.normal, DrawMethod.Fan);
        })
    }
    
}

function fillTop(cylinder: Geometry): {position: number[], index: number[], normal: number[]} {
    var top = {position: [], index: [], normal: []};
    return top;
}

function fillBottom(cylinder: Geometry): {position: number[], index: number[], normal: number[]} {
    var bottom = {position: [], index: [], normal: []};
    return bottom;
}