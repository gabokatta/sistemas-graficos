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
    const indexCalc = (i: number, j: number) => (geometry.cols+1)*i + j;
    for (var i=0; i < geometry.rows; i++) {
        for (var j=0; j <= geometry.cols; j++) {
            indexBuffer.push(indexCalc(i,j), indexCalc(i+1,j));
        }
        indexBuffer.push(indexCalc(i+1, geometry.cols), indexCalc(i+1,0));
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