
import { WebGL } from "../scripts/webgl"
import { Object3D, Transformation } from "../scripts/object";
import { SinTube } from "../scripts/forms/sin-tube";

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();


function tick(){
    //requestAnimationFrame(tick);
    tube.draw(gl);
    //animate(tube);
}


var sonTransforms: Transformation[] = [
    Transformation.translate([-10, 0, 0]),
    Transformation.scale([1.3,1.3, 1.3])
]

var dadTransforms: Transformation[] = [
    Transformation.translate([5, -7, 0]),
    Transformation.scale([0.3,0.3,0.3])
];

var sonTube = new Object3D(new SinTube(256,256, 2, 1, 1, 5), sonTransforms, []);

var tube = new Object3D(new SinTube(256,256, 2, 1, 1, 6), dadTransforms, []);
tube.setChildren([sonTube]);

tick();
