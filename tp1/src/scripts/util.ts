import { mat4, vec3 } from "gl-matrix";

export function applyTransform(transform: mat4,data: any): any {
    return {
        p: vec3.transformMat4(vec3.create(), data.p, transform),
        t: vec3.transformMat4(vec3.create(), data.t, transform),
        n: vec3.transformMat4(vec3.create(), data.n, transform),
        b: vec3.transformMat4(vec3.create(), data.b, transform),
      };
}