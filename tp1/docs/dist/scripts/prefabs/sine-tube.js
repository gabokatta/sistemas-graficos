import {vec3} from "../../../_snowpack/pkg/gl-matrix.js";
import {buildBuffers, buildIndex} from "../geometry.js";
export class SinTube {
  constructor(rows, cols, radio, amplitude, longitude, height) {
    this.index = [];
    this.position = [];
    this.normal = [];
    this.rows = rows;
    this.cols = cols;
    this.amplitude = amplitude;
    this.longitude = longitude;
    this.height = height;
    this.radio = radio;
    buildBuffers(this);
    buildIndex(this);
  }
  getNormals(alfa, beta) {
    var p = this.getPosition(alfa, beta);
    var v = vec3.create();
    vec3.normalize(v, vec3.fromValues(p[0], p[1], p[2]));
    var delta = 0.05;
    var p1 = this.getPosition(alfa, beta);
    var p2 = this.getPosition(alfa, beta + delta);
    var p3 = this.getPosition(alfa + delta, beta);
    var v1 = vec3.fromValues(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
    var v2 = vec3.fromValues(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);
    vec3.normalize(v1, v1);
    vec3.normalize(v2, v2);
    var n = vec3.create();
    vec3.cross(n, v1, v2);
    vec3.scale(n, n, -1);
    return n;
  }
  getPosition(alfa, beta) {
    const phi = beta * Math.PI * 2;
    const theta = alfa * Math.PI * 2;
    const sin_theta = Math.sin(theta / this.longitude);
    const x = (this.radio + this.amplitude * sin_theta) * Math.cos(phi);
    const y = this.height * alfa;
    const z = (this.radio + this.amplitude * sin_theta) * Math.sin(phi);
    return vec3.fromValues(x, y, z);
  }
  draw(gl) {
    gl.draw(this.position, this.index, this.normal);
  }
}
;
