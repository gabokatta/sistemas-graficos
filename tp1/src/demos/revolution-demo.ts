import {WebGL } from "../scripts/webgl"
import { Object3D, Transformation } from "../scripts/object";
import { Bottle } from "../scripts/prefabs/bottle";

const vertexShaderPath = '../dist/shaders/vertex.glsl';
const fragmentShaderPath = '../dist/shaders/fragment.glsl';

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
let angle = 0;

function animate(t: number) {
    sweep.updateTransform([
        Transformation.rotation(t*2, [1,0,0]),
        Transformation.rotation(t, [0,0,1])
    ]);
}

function tick() {
    requestAnimationFrame(tick);
    sweep.draw(gl);
    angle += 0.01
    animate(angle);
}

let sweep =  new Object3D(new Bottle(1,2.5), [Transformation.scale([0.5,0.5,0.5])], [0.5,1,0.2]);
gl.setNormalColoring(true);
tick();




