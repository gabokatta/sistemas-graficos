import { WebGL } from "../scripts/webgl"
import { Cylinder } from "../scripts/prefabs/cylinder";
import { Object3D, Transformation } from "../scripts/object";

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();
var angle = 0;

function animate(t: number) {
    cylinder.updateTransform([
        Transformation.rotation(t, [1,0,1]),
        Transformation.rotation(t*3, [0,1,0])
    ]);
    cylinderSon.updateTransform([
        Transformation.rotation(t*6, [0,0,1])
    ])
}

function tick() {
    requestAnimationFrame(tick);
    cylinder.draw(gl);
    angle += 0.01
    animate(angle);
}

var sonTransforms = [
    Transformation.scale([0.5, 0.5, 0.5]),
    Transformation.translate([-4, 0,0])
]

var cylinderSon = new Object3D(new Cylinder(100,100, 1, 3), sonTransforms, []);
var cylinder = new Object3D(new Cylinder(100,100, 1, 3), [], []);
cylinder.setChildren([cylinderSon]);
tick();

//TODO: NO ME COMPLETA EL CILINDRO POR ALCUNA RAZON.. :(
//TODO: Las normales no me convecen del todo como estan pintadas



