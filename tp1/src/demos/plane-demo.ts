import { DrawMethod, WebGL } from "../scripts/webgl"
import { Object3D, Transformation } from "../scripts/object";
import { Plane } from "../scripts/forms/plane";

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();
//gl.setDrawMethod(DrawMethod.Smooth);

function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}

function tick(){
    //requestAnimationFrame(tick);
    plane.draw(gl);
    //animate(plane);
}

var baseTransforms: Transformation[] = [
    Transformation.rotation(to_rads(45), [1, 0, 0]),
    Transformation.scale([3,3,3])
]

var plane = new Object3D(new Plane(15,15, 6,6), baseTransforms, []);

tick();
