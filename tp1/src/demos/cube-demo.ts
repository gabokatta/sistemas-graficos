import { DrawMethod, WebGL } from "../scripts/webgl"
import { Object3D, Transformation } from "../scripts/object";
import { Cube } from "../scripts/prefabs/cube";

const vertexShaderPath = '../dist/shaders/vertex.glsl';
const fragmentShaderPath = '../dist/shaders/fragment.glsl';

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
var angle = 0;
var inverse = true;

function animate(t: number) {
    cube.updateTransform([
        Transformation.rotation(t, [1,0,1]),
        Transformation.rotation(t*3, [0,1,0])
    ]);

    let u;
    let v;
    const mod = (n: number) => {return Number((n).toFixed(2)) % 1.5;}

    if (mod(t) == 0) {
        inverse = !inverse;
    }

    u =  inverse ? mod(t) : 1.5 - mod(t);
    v = !inverse ? mod(t) : 1.5 - mod(t)

    cubeSon.updateTransform([
        Transformation.rotation(t*6, [0,0,1]),
        Transformation.scale([v,v,v])
    ]);
    cubeSon2.updateTransform([
        Transformation.rotation(-t*6, [1,0,1]),
        Transformation.scale([u,u,u])
    ])
}

function tick() {
    requestAnimationFrame(tick);
    cube.draw(gl);
    angle += 0.01
    animate(angle);
}

var son2Transforms = [
    Transformation.scale([0.5, 0.5, 0.5]),
    Transformation.translate([4, 0,0])
]

var sonTransforms = [
    Transformation.scale([0.5, 0.5, 0.5]),
    Transformation.translate([-4, 0,0])
]

var cubeSon = new Object3D(new Cube(2), sonTransforms, []);
var cubeSon2 = new Object3D(new Cube(2), son2Transforms, []);
var cube = new Object3D(new Cube(2), [], []);
cube.setChildren([cubeSon, cubeSon2]);
tick();
