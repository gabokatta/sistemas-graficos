import type { vec3 } from "gl-matrix";
import { buildBuffers, buildIndex, Geometry } from "../geometry";
import type { WebGL } from "../webgl";

export class Plane implements Geometry {

    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];

    rows: number;
    cols: number;
    height: number;
    width: number;

    constructor(rows: number, cols: number, width: number, height: number) {
      this.rows = rows;
      this.cols = cols;
      this.width = width;
      this.height = height;

      buildBuffers(this);
      buildIndex(this);
    };

    getNormals(alfa: number, beta: number): vec3 {
        return [0,1,0];
    }

    getPosition(alfa: number, beta: number): vec3 {
        var x=(alfa-0.5)*this.width;
        var z=(beta-0.5)*this.height;
        return [x,0,z];
    }

    draw(gl: WebGL): void {
        gl.draw(this.position, this.index, this.normal);
    }
    
}