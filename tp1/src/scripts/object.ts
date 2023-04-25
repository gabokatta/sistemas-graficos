import { mat4, vec3 } from "gl-matrix";
import type { Geometry } from "./geometry";
import type { WebGL } from "./webgl";

export class Object3D {
    transform: mat4;
    transformations: Transformation[];
    children: Object3D[];
    geometry: Geometry | null;
    color: vec3;
  
    constructor(geometry = null, transformations= [], color = vec3.fromValues(0, 0, 0)) {
      this.transform = mat4.create();
      this.transformations = transformations.reverse();

      this.children = [];
      this.geometry = geometry;
      this.color = color;
  
      this.transformations.forEach((t) => this.applyTransformation(t, this.transform));
    }
  
    draw(gl: WebGL, parent: mat4 = mat4.create()) {

      const m = mat4.create();
      mat4.multiply(m, parent, this.transform);

      if (this.geometry) {
        gl.setMatrix("modelMatrix", m);
        this.geometry.draw(gl);
      }
  
      this.children.forEach((c) => c.draw(gl, m));
    }
  
    applyTransformation(transformation: Transformation, matrix: mat4): void {
      switch (transformation.type) {
        case TransformationType.Translation:
          mat4.translate(this.transform, this.transform, transformation.getData());
          break;
        case TransformationType.Scaling:
          mat4.scale(this.transform, this.transform, transformation.getData());
          break;
        case TransformationType.Rotation:
          var data: any = transformation.getRotData();
          mat4.rotate(this.transform, this.transform, data[0], data[1]);
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
  