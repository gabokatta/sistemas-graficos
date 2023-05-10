import {vec3} from "../../snowpack/pkg/gl-matrix.js";
export function applyTransform(transform, data) {
  return {
    p: vec3.transformMat4(vec3.create(), data.p, transform),
    t: vec3.transformMat4(vec3.create(), data.t, transform),
    n: vec3.transformMat4(vec3.create(), data.n, transform),
    b: vec3.transformMat4(vec3.create(), data.b, transform)
  };
}
