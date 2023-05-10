import {mat4, vec3} from "../../snowpack/pkg/gl-matrix.js";
export const DEFAULT_DELTA_REV = 1 / 8;
export class Revolution {
  constructor(orientation, angle = 2 * Math.PI) {
    this.orientation = orientation;
    this.angle = angle;
  }
  getPointData(u) {
    let {p, t, n} = this.orientation;
    let u_angle = this.angle * u;
    let rotation = mat4.fromRotation(mat4.create(), u_angle, n);
    let new_t = vec3.transformMat4(vec3.create(), t, rotation);
    return {p, t: new_t, n};
  }
  glDraw(gl, delta = DEFAULT_DELTA_REV, controlPoints = false) {
    [0, 1].forEach((u) => {
      const {p, t} = this.getPointData(u);
      gl.drawVec([...vec3.scaleAndAdd(vec3.create(), p, t, 2).values()], t, 0.1);
    });
    for (let u = 0; u <= 1.001; u = u + delta) {
      const {p, t, n} = this.getPointData(u);
      gl.drawVec(p, t, 0.2);
      gl.drawVec(p, n, 0.4);
    }
  }
}
