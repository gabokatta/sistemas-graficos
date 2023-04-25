import { WebGL } from "../scripts/webgl"
import { WeirdSphere } from "../scripts/forms/weird-sphere";
import { Object3D, Transformation } from "../scripts/object";

//var rotate_angle = -1.57078;
var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();


function tick(){
    requestAnimationFrame(tick);
    sphere.draw(gl);
    //animate(sphere);
}

var grandkidTransform: Transformation[] = [
    Transformation.scale([0.7, 0.7, 0.7]),
    Transformation.translate([8,6, 10])
];
var grandkidSphere = new Object3D(new WeirdSphere(128,256), grandkidTransform, []);


var sonTransforms: Transformation[] = [
    Transformation.translate([-9, 2, -20])
]
var sonSphere = new Object3D(new WeirdSphere(128,256), sonTransforms, []);
sonSphere.setChildren([grandkidSphere]);

var sphere = new Object3D(new WeirdSphere(128,256), [], []);
sphere.setChildren([sonSphere]);

tick();
