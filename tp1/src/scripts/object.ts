import { mat4, vec3 } from "gl-matrix";
import type { Geometry3D } from "./geometry";
import type { WebGL } from "./webgl";

export class Object3D {
    transformMatrix: mat4;
    transformations: Transformation[];
    children: Object3D[];
    geometry: Geometry3D | null;
    color: vec3;
  
    constructor(geometry = null, transformations= [], color = vec3.fromValues(1, 0, 0)) {
      this.transformMatrix = mat4.create();
      this.transformations = transformations.reverse();

      this.children = [];

      this.geometry = geometry;
      this.color = color;
  
      this.transformations.forEach((t) => this.applyTransformation(t, this.transformMatrix));
    }
  
    draw(gl: WebGL, parentMatrix: mat4 = mat4.create()) {

      const combinedMatrix = mat4.create();
      mat4.multiply(combinedMatrix, parentMatrix, this.transformMatrix);

      if (this.geometry) {
        gl.setMatrix("modelMatrix", combinedMatrix);
        this.geometry.draw(combinedMatrix);
      }
  
      this.children.forEach((c) => c.draw(gl, combinedMatrix));
    }
  
    applyTransformation(transformation: Transformation, matrix: mat4): void {
      switch (transformation.type) {
        case TransformationType.Translation:
          mat4.translate(this.transformMatrix, this.transformMatrix, transformation.getData());
          break;
        case TransformationType.Scaling:
          mat4.scale(this.transformMatrix, this.transformMatrix, transformation.getData());
          break;
        case TransformationType.Rotation:
          var data: any = transformation.getRotData();
          mat4.rotate(this.transformMatrix, this.transformMatrix, data[0], data[1]);
          break;
        default:
          console.warn(`Invalid transformation type: ${transformation.type}`);
          break;
      }
    }
  
    setChildren(children: Object3D[]): void {
      this.children = children;
    }
}

enum TransformationType {
    Translation,
    Rotation,
    Scaling,
  }
  
class Transformation {
    type: TransformationType;
    data: number[];

    getData() : vec3 {
        return vec3.fromValues(this.data[0], this.data[1], this.data[2]);
    }

    getRotData() : any[] {
        return [this.data[0], [this.data[1], this.data[2], this.data[3]]]
    }
  
    constructor(type: TransformationType, data: number[]) {
      this.type = type;
      this.data = data;
    }
}
  