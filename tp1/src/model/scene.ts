import { mat4  } from "gl-matrix";
import { WebGL } from "../scripts/webgl"
import { WeirdSphere } from "../scripts/forms/weird-sphere";

var rotate_angle = -1.57078;
var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();
var sphere = new WeirdSphere(128,256);

function animate(){  

    var model: mat4 = gl.modelMatrix;
    var view: mat4 = gl.viewMatrix;
    var normal: mat4 = gl.normalMatrix;

    rotate_angle += 0.05;
    mat4.identity(model);
    mat4.rotate(model,model, rotate_angle, [1.0, 0.0, 1.0]);

    mat4.identity(normal);
    mat4.multiply(normal,view,model);
    mat4.invert(normal,normal);
    mat4.transpose(normal,normal);

    gl.updateMatrices(model, view, normal);
}

function tick(){
    requestAnimationFrame(tick);
    sphere.draw(gl);
    animate();
}

tick();
