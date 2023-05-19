import {mat4, vec3} from "../../snowpack/pkg/gl-matrix.js";
import {getDrawableNormals} from "./geometry.js";
export class Object3D {
  constructor(geometry, transformations, color) {
    this.transformations = [];
    this.drawableNormals = [];
    this.showNormals = false;
    this.transform = mat4.create();
    this.transformations = transformations.reverse();
    this.children = [];
    this.geometry = geometry;
    this.color = color;
    this.transformations.forEach((t) => this.applyTransformation(t));
  }
  draw(gl, parent = mat4.create()) {
    const m = mat4.create();
    mat4.multiply(m, parent, this.transform);
    if (this.geometry) {
      gl.setModel(m);
      gl.setColor(this.color);
      this.geometry.draw(gl);
      if (this.showNormals) {
        let normals = this.drawableNormals.length == 0 ? getDrawableNormals(this.geometry) : this.drawableNormals;
        gl.drawObjectNormals(normals);
      }
    }
    this.children.forEach((c) => c.draw(gl, m));
  }
  applyTransformation(transformation) {
    switch (transformation.type) {
      case TransformationType.Translation:
        mat4.translate(this.transform, this.transform, transformation.getData());
        break;
      case TransformationType.Scaling:
        mat4.scale(this.transform, this.transform, transformation.getData());
        break;
      case TransformationType.Rotation:
        var data = transformation.getRotData();
        mat4.rotate(this.transform, this.transform, data[0], data[1]);
        break;
      default:
        console.warn(`Invalid transformation type: ${transformation.type}`);
        break;
    }
  }
  updateTransform(newTransforms) {
    mat4.identity(this.transform);
    this.transformations.forEach((t) => this.applyTransformation(t));
    newTransforms.forEach((t) => {
      this.applyTransformation(t);
    });
  }
  setChildren(children) {
    children.forEach((c) => {
      this.children.push(c);
    });
  }
}
var TransformationType;
(function(TransformationType2) {
  TransformationType2[TransformationType2["Translation"] = 0] = "Translation";
  TransformationType2[TransformationType2["Rotation"] = 1] = "Rotation";
  TransformationType2[TransformationType2["Scaling"] = 2] = "Scaling";
})(TransformationType || (TransformationType = {}));
export class Transformation {
  static rotation(angle, axis) {
    return new Transformation(1, [angle, axis[0], axis[1], axis[2]]);
  }
  static scale(factors) {
    return new Transformation(2, factors);
  }
  static translate(movement) {
    return new Transformation(0, movement);
  }
  getData() {
    return vec3.fromValues(this.data[0], this.data[1], this.data[2]);
  }
  getRotData() {
    return [this.data[0], [this.data[1], this.data[2], this.data[3]]];
  }
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
}
