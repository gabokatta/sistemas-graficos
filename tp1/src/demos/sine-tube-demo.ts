
import { DrawMethod, WebGL } from "../scripts/webgl"
import { Object3D, Transformation } from "../scripts/object";
import { SinTube } from "../scripts/prefabs/sine-tube";

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();

function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}


var baseTransforms: Transformation[] = [
    Transformation.translate([-5, -5, -10])
]

var tube = new Object3D(new SinTube(100,100, 2, 0.4, 0.1, 15), baseTransforms, []);


tube.draw(gl);
