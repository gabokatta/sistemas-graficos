import { vec3 } from "gl-matrix";
import { CurveLevel } from "../scripts/curves/curve";
import { BSpline } from "../scripts/curves/bspline";
import { Bezier } from "../scripts/curves/bezier";

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var ctx = canvas.getContext("2d")!;
const points = [
    // Seg 1
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 200, 0),
    vec3.fromValues(200, 200, 0),
    vec3.fromValues(200, 100, 0),
    // Seg 2
    vec3.fromValues(200, 0, 0),
    vec3.fromValues(400, 0, 0),
    vec3.fromValues(400, 200, 0),
    // Seg 3
    vec3.fromValues(400, 400, 0),
    vec3.fromValues(300, 300, 0),
    vec3.fromValues(200, 300, 0),
    // Seg 4
    vec3.fromValues(100, 300, 0),
    vec3.fromValues(0, 200, 0),
    vec3.fromValues(0, 200, 0),
];

points.forEach((p) => {
    p[0] += 500;
    p[1] += 200
    return p;
})

var global_u = 0;
var curve = new BSpline(points, CurveLevel.CUBIC);

// TODO: BSpline cubic tangent is not working properly.


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

     // dibujar punto de la curva en verde
     global_u += 0.002;
     ctx.lineWidth=5;
     ctx.beginPath();
     ctx.arc(punto.point[0],punto.point[1],10,0,2*Math.PI);
     ctx.strokeStyle="#0000FF";
     ctx.stroke();

    console.log(punto.point, punto.normal);
    drawVector(punto.point[0], punto.point[1], punto.tangent[0] * 50, punto.tangent[1] * 50, "#FF0000");
    drawVector(punto.point[0], punto.point[1], punto.normal[0] * 50, punto.normal[1] * 50, "#00FF00");

    if (global_u > 1) global_u = 0;

};

animate();