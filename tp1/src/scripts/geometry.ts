import { vec3 } from "gl-matrix";
import type { WebGL } from "./webgl";

export interface Geometry{

    index: number[];
    position: number[];
    normal: number[];
    binormal: number[];
    tangent: number[];

    reverseUV: boolean;
    uvFactors: number[];
    uv: number[];


    rows: number;
    cols: number;

    getPointData(alfa: number, beta: number): any;
    draw(gl: WebGL): void;
}

export function getDrawableNormals(geometry: Geometry): vec3[] {
    let normals: vec3[] = [];
    for (let i = 0; i <= geometry.position.length - 3; i += 3) {
        normals.push(vec3.fromValues(geometry.position[i], geometry.position[i + 1], geometry.position[i + 2]));
        normals.push(vec3.fromValues(
            geometry.position[i] + geometry.normal[i], 
            geometry.position[i + 1] + geometry.normal[i + 1], 
            geometry.position[i + 2] + geometry.normal[i + 2])
        );
    }
    return normals;
}

export function buildIndex(geometry: Geometry): void {   
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
    
    for (var i=0;i<=rows;i++){
        for (var j=0;j<=cols;j++) {
    
            var alfa=i/rows;
            var beta=j/cols;

            var {p, n, b, t, u, v} = geometry.getPointData(alfa, beta) 
            geometry.position.push(...p);
            geometry.normal.push(...n);
            geometry.binormal.push(...b);
            geometry.tangent.push(...t);

            if (geometry.reverseUV) {
                geometry.uv.push(v*geometry.uvFactors[1], u*geometry.uvFactors[0]);
            }
            else {
                geometry.uv.push(u*geometry.uvFactors[0], v*geometry.uvFactors[1]);
            }
        }
    }
}