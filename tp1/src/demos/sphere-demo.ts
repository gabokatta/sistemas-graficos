import { WebGL } from "../scripts/webgl"
import { Sphere } from "../scripts/prefabs/sphere";
import { Object3D, Transformation } from "../scripts/object";

const vertexShaderPath = '../dist/shaders/vertex.glsl';
const fragmentShaderPath = '../dist/shaders/fragment.glsl';

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init(vertexShaderPath,  fragmentShaderPath);
let angle = 0;
let inverse = true;

function animate(t: number) {
    sphere.updateTransform([
        Transformation.rotation(t/2, [0,1,0])
    ]);


    let u;
    const mod = (n: number) => {return Number((n).toFixed(2)) % 2;}

    if (mod(t) == 0) {
        inverse = !inverse;
    }

    u =  inverse ? mod(t) : 2 - mod(t);


    sonSphere.updateTransform([
        Transformation.translate([u,u,0])
    ]);
    sonSphere2.updateTransform([
        Transformation.translate([-u,u,0])
    ]);
    sonSphere3.updateTransform([
        Transformation.translate([0,0,u])
    ]);
}

function tick() {
    requestAnimationFrame(tick);
    sphere.draw(gl);
    angle += 0.01
    animate(angle);
}

function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}

var sonTransforms: Transformation[] = [
    Transformation.translate([3, 4, 0])
]

var sonTransforms2: Transformation[] = [
    Transformation.translate([-3, 4, 0])
]

var sonTransforms3: Transformation[] = [
    Transformation.rotation(to_rads(60), [0,0,1]),
    Transformation.translate([0, 0, 4.5])
]

// TODO: Tras cierto numero de rows/columns, se deforman las esferas. Ej: 300

var sonSphere3 = new Object3D(new Sphere(60,60, 0.5), sonTransforms3, []);
var sonSphere2 = new Object3D(new Sphere(60,60, 2), sonTransforms2, []);
var sonSphere = new Object3D(new Sphere(60,60, 2), sonTransforms, []);

var sphere = new Object3D(new Sphere(60,60, 4), [
    Transformation.rotation(to_rads(90), [0,-1,0]),
    Transformation.scale([0.4,0.4,0.4]), 
    Transformation.translate([0,-1,0])
], 
[]
);
sphere.setChildren([sonSphere, sonSphere2, sonSphere3]);
tick();
