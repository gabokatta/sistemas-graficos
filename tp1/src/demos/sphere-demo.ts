import { DrawMethod, WebGL } from "../scripts/webgl"
import { Sphere } from "../scripts/forms/sphere";
import { Object3D } from "../scripts/object";

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();

// TODO: Weird render bug.
var sphere = new Object3D(new Sphere(200,200, 4), [], []);
sphere.draw(gl);
