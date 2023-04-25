import type { vec3 } from "gl-matrix";
import type { WebGL } from "./webgl";

export interface Geometry {

    index: number[];
    position: number[];
    normal: number[];

    rows: number;
    cols: number;

    buildBuffers(): void;

    getNormals(alfa: number, beta: number) : vec3;

    getPosition(alfa: number, beta: number) : vec3;

    buildIndex() : void;

    draw(gl: WebGL): void;
}