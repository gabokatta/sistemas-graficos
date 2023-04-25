import { DrawMethod, WebGL } from "../scripts/webgl"
import { Sphere } from "../scripts/forms/sphere";
import { Object3D } from "../scripts/object";

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();

// TODO: Ask teacher why bug with rows and cols gt 250
var sphere = new Object3D(new Sphere(100,100, 4), [], []);
sphere.draw(gl);
