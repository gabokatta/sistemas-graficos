import { vec3 } from "gl-matrix";
import { CurveLevel } from "../scripts/curves/curve";
import { BSpline } from "../scripts/curves/bspline";
import { Bezier } from "../scripts/curves/bezier";

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var ctx = canvas.getContext("2d")!;
const points: vec3[] = [
    vec3.fromValues(100,100,0),
    vec3.fromValues(400,100,0),
    vec3.fromValues(400,400,0),
    vec3.fromValues(100,400,0),
    vec3.fromValues(100,100,0),
];

points.forEach(p => {
    p[0] += 500;
    p[1] += 150
})

var curr_seg: number;
var global_u = 0;
var convexities: Function[] = [

];
var curve = BSpline.straightLines(points);
curve.changeBinormalDirection(Array.from(curve.segments.keys()), [0,0,1])

function drawVector(x1: number, y1: number, x2: number, y2: number, color: string) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + x2, y1 + y2);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, 1000, 1000);
    curve.draw(ctx);

    let punto = curve.getPointData(global_u);
    if (curr_seg != curve.segments.indexOf(curve.coordToSegment(global_u).segment)){
        console.log(curve.segments.indexOf(curve.coordToSegment(global_u).segment))
        console.log("Binormal: " , [punto.binormal[0], punto.binormal[1], punto.binormal[2]]);
    }
    curr_seg = curve.segments.indexOf(curve.coordToSegment(global_u).segment);
     // dibujar punto de la curva en verde
     global_u += 0.0015;
     ctx.lineWidth=5;
     ctx.beginPath();
     ctx.arc(punto.point[0],punto.point[1],10,0,2*Math.PI);
     ctx.strokeStyle="#0000FF";
     ctx.stroke();

    drawVector(punto.point[0], punto.point[1], punto.tangent[0] * 50, punto.tangent[1] * 50, "#FF0000");
    drawVector(punto.point[0], punto.point[1], punto.normal[0] * 50, punto.normal[1] * 50, "#00FF00");

    if (global_u > 1) global_u = 0;

};

animate();
