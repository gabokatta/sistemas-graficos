import { WebGL } from "../scripts/webgl"
import { Cylinder } from "../scripts/forms/cylinder";
import { Object3D, Transformation } from "../scripts/object";

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();

function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}

var baseTransforms: Transformation[] = [
    Transformation.rotation(to_rads(150), [0, 0, 1]),
    Transformation.rotation(to_rads(90), [0, 1, 0]),
]

//TODO: NO ME COMPLETA EL CILINDRO POR ALCUNA RAZON.. :(
//TODO: Las normales no me convecen del todo como estan pintadas


var cylinder = new Object3D(new Cylinder(100,100, 1, 3), baseTransforms, []);
cylinder.draw(gl);
