
import { DrawMethod, WebGL } from "../scripts/webgl"
import { Object3D, Transformation } from "../scripts/object";
import { SinTube } from "../scripts/prefabs/sine-tube";

const vertexShaderPath = '../dist/shaders/vertex.glsl';
const fragmentShaderPath = '../dist/shaders/fragment.glsl';

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
let angle = 0;
var inverse = true;

function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}

function animate(t: number) {
    tube.updateTransform([
        Transformation.rotation(t/2, [0,0,1])
    ]);

    let u;
    let v;
    const mod = (n: number) => {return Number((n).toFixed(2)) % 4;}

    if (mod(t) == 0) {
        inverse = !inverse;
    }

    u =  inverse ? mod(t) : 4 - mod(t);
    v =  -u;

    tube2.updateTransform([
        Transformation.translate([0,u*25,0])
    ]);

    tube3.updateTransform([
        Transformation.translate([0,v*25,0])
    ]);
}

function tick() {
    requestAnimationFrame(tick);
    tube.draw(gl);
    angle += 0.01
    animate(angle);
}


var baseTransforms: Transformation[] = [
    Transformation.scale([0.5,0.5,0.5]),
    Transformation.rotation(to_rads(90),[1,0,0]),
    Transformation.translate([3,0,-13]),
]

var sonTransforms: Transformation[] = [
    Transformation.scale([0.5,0.5,0.5])
]

var son2Transforms: Transformation[] = [
    Transformation.scale([0.3,0.3,0.3])
]

var tube3 = new Object3D(new SinTube( 2, 0.4, 0.1, 15), son2Transforms, []);
var tube2 = new Object3D(new SinTube( 2, 0.4, 0.1, 15), sonTransforms, []);
var tube = new Object3D(new SinTube( 2, 0.4, 0.1, 15), baseTransforms, []);
tube.setChildren([tube2, tube3]);

tick();
