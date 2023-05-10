import { mat4, vec3 } from "gl-matrix";
import type { WebGL } from "./webgl";
import type { Path } from "./sweep";

export const DEFAULT_DELTA_REV: number = 1/8;

export class Revolution implements Path {

    orientation: any;
    angle: number;

    constructor(orientation: any, angle: number = 2*Math.PI) {
        this.orientation = orientation;
        this.angle = angle;
    }
    

    getPointData(u: number): any{
        let { p, t, n } = this.orientation;
        let u_angle: number = this.angle * u;
        let rotation: mat4 = mat4.fromRotation(mat4.create(), u_angle, n);
        let new_t: vec3 = vec3.transformMat4(vec3.create(), t, rotation);
        return {p, t: new_t, n};
    }

    glDraw(gl: WebGL, delta: number = DEFAULT_DELTA_REV, controlPoints: boolean = false): void {
        [0, 1].forEach((u) => {
            const { p, t } = this.getPointData(u);
            gl.drawVec([...vec3.scaleAndAdd(vec3.create(), p, t, 2).values()], t, 0.1);
          });
          for (let u = 0; u <= 1.001; u = u + delta) {
            const { p, t, n } = this.getPointData(u);
            gl.drawVec(p, t, 0.2);
            gl.drawVec(p, n, 0.4);
          }
        }
}