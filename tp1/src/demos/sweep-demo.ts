import { DrawMethod, WebGL } from "../scripts/webgl"
import { Object3D, Transformation } from "../scripts/object";
import { SweepSurface } from "../scripts/sweep/sweep";
import { Path } from "../scripts/sweep/path";
import { Bezier } from "../scripts/curves/bezier";
import { CurveLevel } from "../scripts/curves/curve";
import { vec3 } from "gl-matrix";

const vertexShaderPath = '../dist/shaders/vertex.glsl';
const fragmentShaderPath = '../dist/shaders/fragment.glsl';

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
let angle = 0;

function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}

function animate(t: number) {
    sweep.updateTransform([
        Transformation.rotation(t, [1,0,1]),
        Transformation.rotation(t*3, [0,1,0])
    ]);
}

function getPath() {
    const points = [
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 2, 0),
        vec3.fromValues(2, 2, 0),
        vec3.fromValues(2.5, 2, 0),
        vec3.fromValues(3, 2, 0),
    ];

    return new Bezier(points, CurveLevel.CUADRATIC);
}

function getShape() {
    const points = [
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(1.5, 3, 0),
        vec3.fromValues(1.5, 3, 0),
        vec3.fromValues(1.5, 3, 0),
        vec3.fromValues(3, 0, 0),
        vec3.fromValues(3, 0, 0),
        vec3.fromValues(3, 0, 0),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 0, 0),
    ];

    return new Bezier(points, CurveLevel.CUBIC);
}

function tick() {
    requestAnimationFrame(tick);
    sweep.draw(gl);
    angle += 0.01
    animate(angle);
}

let path  = getPath();
let shape = getShape();
console.log(path);
let sweepable = new Path(shape, path);
let sweep =  new Object3D(new SweepSurface(sweepable), [], [0.5,1,0.2]);
gl.setNormalColoring(true);
tick();




