import { WebGL } from "../scripts/webgl"
import { Object3D, Transformation } from "../scripts/object";
import { Revolution } from "../scripts/revolution";
import { BSpline } from "../scripts/curves/bspline";
import { vec3 } from "gl-matrix";
import { Surface, SweepSurface } from "../scripts/sweep";

const vertexShaderPath = '../dist/shaders/vertex.glsl';
const fragmentShaderPath = '../dist/shaders/fragment.glsl';

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
var angle = 0;

function animate(t: number) {
    sweep.updateTransform([
        Transformation.rotation(t, [1,0,1]),
        Transformation.rotation(t*3, [0,1,0])
    ]);
}

function tick() {
    requestAnimationFrame(tick);
    sweep.draw(gl);
    angle += 0.01
    animate(angle);
    
}

function getOrientation(x: number = 0, y: number = 0, z: number = 0 ) {
    return {
        p: vec3.fromValues(x, y, z),
        n: vec3.fromValues(0,1,0),
        t: vec3.fromValues(0,0,-1)
    }
}

function getShape(len: number) {
    return BSpline.straightLines([
        [-len / 2 , -len / 2 , 0],
        [-len / 2, len / 2 , 0],
        [len / 2, len / 2, 0],
        [len / 2, -len / 2, 0],
        [-len / 2, -len / 2, 0]
    ])
}

function getPath(revAngle: number): Revolution {
    let p = vec3.fromValues(0,0,0)
    let n = vec3.fromValues(0,1,0)
    let t = vec3.fromValues(1,0,0)
    return new Revolution({p, n, t}, revAngle);
}

let shape: BSpline = getShape(2);
let surface = new Surface(shape, getOrientation());
let path: Revolution = getPath(5);


var sweep = new Object3D(new SweepSurface(surface, path), [], []);
tick();
