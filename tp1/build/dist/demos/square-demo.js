import {vec3} from "../../snowpack/pkg/gl-matrix.js";
import {BSpline} from "../scripts/curves/bspline.js";
var canvas = document.getElementById("my-canvas");
var ctx = canvas.getContext("2d");
const points = [
  vec3.fromValues(100, 100, 0),
  vec3.fromValues(400, 100, 0),
  vec3.fromValues(400, 400, 0),
  vec3.fromValues(100, 400, 0),
  vec3.fromValues(100, 100, 0)
];
points.forEach((p) => {
  p[0] += 500;
  p[1] += 150;
});
var curr_seg;
var global_u = 0;
var convexities = [];
var curve = BSpline.straightLines(points);
curve.changeBinormalDirection(Array.from(curve.segments.keys()), [0, 0, 1]);
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
    console.log("Binormal: ", [punto.b[0], punto.b[1], punto.b[2]]);
  }
  curr_seg = curve.segments.indexOf(curve.coordToSegment(global_u).segment);
  global_u += 15e-4;
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
