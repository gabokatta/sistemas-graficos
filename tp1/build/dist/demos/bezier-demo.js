import {vec3} from "../../snowpack/pkg/gl-matrix.js";
import {CurveLevel} from "../scripts/curves/curve.js";
import {Bezier} from "../scripts/curves/bezier.js";
var canvas = document.getElementById("my-canvas");
var ctx = canvas.getContext("2d");
const points = [
  vec3.fromValues(0, 0, 0),
  vec3.fromValues(0, 200, 0),
  vec3.fromValues(200, 200, 0),
  vec3.fromValues(200, 100, 0),
  vec3.fromValues(200, 0, 0),
  vec3.fromValues(400, 0, 0),
  vec3.fromValues(400, 200, 0),
  vec3.fromValues(400, 400, 0),
  vec3.fromValues(300, 300, 0),
  vec3.fromValues(200, 300, 0),
  vec3.fromValues(100, 300, 0),
  vec3.fromValues(0, 200, 0),
  vec3.fromValues(0, 200, 0)
];
points.forEach((p) => {
  p[0] += 500;
  p[1] += 200;
  return p;
});
var curr_seg;
var global_u = 0;
var curve = new Bezier(points, CurveLevel.CUBIC);
function drawVector(x1, y1, x2, y2, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + x2, y1 + y2);
  ctx.strokeStyle = color;
  ctx.stroke();
}
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, 1e3, 1e3);
  curve.draw(ctx);
  let punto = curve.getPointData(global_u);
  if (curr_seg != curve.segments.indexOf(curve.coordToSegment(global_u).segment)) {
    console.log(curve.segments.indexOf(curve.coordToSegment(global_u).segment));
    console.log(punto.p[0], punto.p[1]);
    console.log("Normal: ", [punto.n[0], punto.n[1], punto.n[2]]);
  }
  curr_seg = curve.segments.indexOf(curve.coordToSegment(global_u).segment);
  global_u += 2e-3;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(punto.p[0], punto.p[1], 10, 0, 2 * Math.PI);
  ctx.strokeStyle = "#0000FF";
  ctx.stroke();
  drawVector(punto.p[0], punto.p[1], punto.t[0] * 50, punto.t[1] * 50, "#FF0000");
  drawVector(punto.p[0], punto.p[1], punto.n[0] * 50, punto.n[1] * 50, "#00FF00");
  if (global_u > 1)
    global_u = 0;
}
;
animate();
