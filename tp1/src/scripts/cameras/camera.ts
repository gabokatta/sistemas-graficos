import type { mat4 } from "gl-matrix";
import type { WebGL } from "../webgl";

export interface Camera {


    update(gl: WebGL): void;
    getViewMatrix(): mat4;
    clean(): void;
    
}