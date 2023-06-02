import {mat4, vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {buildBuffers, buildIndex} from "../geometry.js";
export class Sphere {
  constructor(radius) {
    this.rows = 75;
    this.cols = 75;
    this.index = [];
    this.position = [];
    this.normal = [];
    this.binormal = [];
    this.tangent = [];
    this.reverseUV = false;
    this.uvFactors = [1, 1];
    this.uv = [];
    this.radius = radius;
    buildBuffers(this);
    buildIndex(this);
  }
  getPointData(alfa, beta) {
    let applyRot = (mat2, angle, axis) => {
      const newMat = mat4.fromRotation(mat4.create(), angle, axis);
      return mat4.multiply(mat2, newMat, mat2);
    };
    let transformVec = (vec, transform) => {
      let _vec = vec3.fromValues(vec[0], vec[1], vec[2]);
      vec3.transformMat4(_vec, _vec, transform);
      return [_vec[0], _vec[1], _vec[2]];
    };
    let transaleMat = (mat2, vec) => {
      const newMat = mat4.fromTranslation(mat4.create(), vec);
      return mat4.multiply(mat2, newMat, mat2);
    };
    let mat = mat4.create();
    let rot = mat4.create();
    transaleMat(mat, [this.radius, 0, 0]);
    applyRot(mat, Math.PI * (0.5 - beta), [0, 0, 1]);
    applyRot(mat, 2 * Math.PI * alfa, [0, 1, 0]);
    applyRot(rot, Math.PI * (0.5 - beta), [0, 0, 1]);
    applyRot(rot, 2 * Math.PI * alfa, [0, 1, 0]);
    let p = [0, 0, 0];
    p = transformVec(p, mat);
    let t = [0, 1, 0];
    t = transformVec(t, rot);
    let b = [0, 0, 1];
    b = transformVec(b, rot);
    return {p, n: vec3.normalize(vec3.create(), vec3.fromValues(p[0], p[1], p[2])), u: alfa, v: beta, t, b};
  }
  draw(gl) {
    gl.draw(this);
  }
}
;
