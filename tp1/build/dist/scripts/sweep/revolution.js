import {vec3} from "../../../snowpack/pkg/gl-matrix.js";
export class Revolution {
  constructor(shape, angle = Math.PI * 2) {
    this.shape = shape;
    this.angle = angle;
  }
  getPath() {
    throw new Error("Method not implemented.");
  }
  getShape() {
    return this.shape;
  }
  discretizePath(delta) {
    const points = [];
    const normals = [];
    const tangents = [];
    const binormals = [];
    for (let u = 0; u <= 1.001; u += delta) {
      let binormal = vec3.fromValues(0, 1, 0);
      let tangent = vec3.fromValues(Math.cos(u * this.angle), 0, Math.sin(u * this.angle));
      points.push(vec3.fromValues(0, 0, 0));
      binormals.push(vec3.fromValues(0, 1, 0));
      tangents.push(tangent);
      normals.push(vec3.cross(vec3.create(), binormal, tangent));
    }
    return {p: points, n: normals, b: binormals, t: tangents};
  }
}
