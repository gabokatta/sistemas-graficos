import { vec3 } from "gl-matrix";
import type { WebGL } from "../webgl";
import { buildBuffers, buildIndex, Geometry } from "../geometry";

export class SinTube implements Geometry {

    radio: number;
    amplitude: number;
    longitude: number;
    height: number;

    rows: number = 75;
    cols: number = 75;
  
    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];
  
    constructor(radio: number, amplitude: number, longitude: number, height: number) {
      this.amplitude = amplitude;
      this.longitude = longitude;
      this.height = height;
      this.radio = radio;
      buildBuffers(this);
      buildIndex(this);
    }

    getPointData(alfa: number, beta: number) {
      let point = this.getPosition(alfa, beta);
      let normal = this.getNormals(alfa, beta);
      return {p: point, n: normal}
  }
  
    getNormals(alfa: number, beta: number): vec3 {
      var p = this.getPosition(alfa,beta);
      var v = vec3.create();
      vec3.normalize(v, vec3.fromValues(p[0], p[1], p[2]));
  
      var delta=0.05;
      var p1 = this.getPosition(alfa,beta);
      var p2 = this.getPosition(alfa,beta+delta);
      var p3 = this.getPosition(alfa+delta,beta);
  
      var v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
      var v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);
  
      vec3.normalize(v1,v1);
      vec3.normalize(v2,v2);
      
      var n=vec3.create();
      vec3.cross(n,v1,v2);
      vec3.scale(n,n,-1);
      return n;
    }
  
    getPosition(alfa: number, beta: number): vec3 {
        const phi = beta * Math.PI * 2;
        const theta = alfa * Math.PI * 2;
        const sin_theta = Math.sin(theta / this.longitude);
      
        const x = (this.radio + this.amplitude * sin_theta) * Math.cos(phi);
        const y = this.height * alfa;
        const z = (this.radio + this.amplitude * sin_theta) * Math.sin(phi);
      
        return vec3.fromValues(x, y, z);
    }

    draw(gl: WebGL): void {
      gl.draw(this.position, this.index, this.normal);
    }
};