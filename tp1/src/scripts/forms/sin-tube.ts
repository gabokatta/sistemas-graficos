import { vec3 } from "gl-matrix";
import type { WebGL } from "../webgl";
import type { Geometry } from "../geometry";

export class SinTube implements Geometry {

    radio: number;
    amplitude: number;
    longitude: number;
    height: number;

    rows: number;
    cols: number;
  
    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];
  
    constructor(rows: number, cols: number, radio: number, amplitude: number, longitude: number, height: number) {
      this.rows = rows;
      this.cols = cols;
      this.amplitude = amplitude;
      this.longitude = longitude;
      this.height = height;
      this.radio = radio;

      this.buildBuffers();
      this.buildIndex();
    }
  
    buildBuffers(): void {
      var rows=this.rows;
      var cols=this.cols;
  
      for (var i=0;i<rows;i++){
          for (var j=0;j<cols;j++) {
  
              var alfa=j/(cols-1)*Math.PI*2;
              var beta=(0.1+i/(rows-1)*0.8)*Math.PI;
  
              var p = this.getPosition(alfa,beta);
  
              this.position.push(p[0]);
              this.position.push(p[1]);
              this.position.push(p[2]);
  
              var n = this.getNormals(alfa,beta);
  
              this.normal.push(n[0]);
              this.normal.push(n[1]);
              this.normal.push(n[2]);
          }
      }
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
        const phi = alfa * Math.PI * 2;
        const theta = beta * Math.PI * 2;
        const sin_theta = Math.sin(theta / this.longitude);
      
        const x = (this.radio + this.amplitude * sin_theta) * Math.cos(phi);
        const y = this.height * beta;
        const z = (this.radio + this.amplitude * sin_theta) * Math.sin(phi);
      
        return vec3.fromValues(x, y, z);
    }
  
    buildIndex(): void{
      var index=[];
      for (var i=0;i<this.rows-1;i++){
           index.push(i*this.cols);
           for (var j=0;j<this.cols-1;j++){
              index.push(i*this.cols+j);
              index.push((i+1)*this.cols+j);
              index.push(i*this.cols+j+1);
              index.push((i+1)*this.cols+j+1);
          }
          index.push((i+1)*this.cols+this.cols-1);
      }
      this.index = index;
    }

    draw(gl: WebGL): void {
      gl.draw(this.position, this.index, this.normal);
    }
  };