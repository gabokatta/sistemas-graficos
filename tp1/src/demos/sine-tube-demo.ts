
import { DrawMethod, WebGL } from "../scripts/webgl"
import { Object3D, Transformation } from "../scripts/object";
import { SinTube } from "../scripts/forms/sine-tube";

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();


//TODO: Observar que pasa cuando se dibuja con lineas.
//gl.setDrawMethod(DrawMethod.Lines);
//TODO: Las normales no me convecen del todo como estan pintadas

function tick(){
    //requestAnimationFrame(tick);
    tube.draw(gl);
    //animate(tube);
}

function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}


var sonTransforms: Transformation[] = [
    Transformation.rotation(to_rads(45), [-1,0,0]),
    Transformation.translate([10, 0, 0])
]

var baseTransforms: Transformation[] = [
    Transformation.translate([-5, -5, -10])
]

var sonTube = new Object3D(new SinTube(100,100, 2, 0.3, 0.5, 15), sonTransforms, []);

var tube = new Object3D(new SinTube(100,100, 2, 0.3, 0.5, 15), baseTransforms, []);
tube.setChildren([sonTube]);

tick();
