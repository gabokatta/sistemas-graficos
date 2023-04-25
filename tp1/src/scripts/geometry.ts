import type { vec3 } from "gl-matrix";
import type { WebGL } from "./webgl";

export interface Geometry {

    index: number[];
    position: number[];
    normal: number[];

    rows: number;
    cols: number;

    getNormals(alfa: number, beta: number) : vec3;

    getPosition(alfa: number, beta: number) : vec3;

    draw(gl: WebGL): void;
}

export function buildIndex(geometry: Geometry): void{   
    var indexBuffer = [];
    const indexCalc = (i: number, j: number) => j + (geometry.cols + 1) * i;
    for (let i = 0; i < geometry.rows; i++){ 
        for (let j = 0; j <= geometry.cols; j++) { 
            indexBuffer.push(indexCalc(i, j), indexCalc(i + 1, j));
        }
    }
    geometry.index = indexBuffer;
  }

export function buildBuffers(geometry: Geometry): void  {
    var rows=geometry.rows;
    var cols=geometry.cols;
    
    for (var i=0;i<rows;i++){
        for (var j=0;j<cols;j++) {
    
            var alfa=j/cols;
            var beta=i/rows;
    
            var p = geometry.getPosition(alfa,beta);  
            geometry.position.push(...p);

            var n = geometry.getNormals(alfa,beta);
            geometry.normal.push(...n);
        }
    }
}