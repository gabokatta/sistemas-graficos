import {mat4, vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {DroneState} from "./state.js";
export class Drone {
  constructor(gl, position = [0, 0, 0], direction = [0, 0, -1]) {
    this.state = new DroneState();
    this.up = vec3.fromValues(0, 1, 0);
    this.side = vec3.fromValues(1, 0, 0);
    this.initialPosition = position;
    this.initialDirection = direction;
    this.position = position;
    this.direction = direction;
    this.keyDownListener = document.addEventListener("keydown", (e) => {
      const vel = 1;
      switch (e.key) {
        case "ArrowUp":
        case "w":
          this.state.fwd = vel;
          break;
        case "ArrowDown":
        case "s":
          this.state.fwd = -vel;
          break;
        case "ArrowLeft":
        case "a":
          this.state.right = -vel;
          break;
        case "ArrowRight":
        case "d":
          this.state.right = vel;
      }
    });
    this.keyUpListener = document.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "ArrowDown":
        case "s":
          this.state.fwd = 0;
          break;
        case "ArrowLeft":
        case "a":
        case "ArrowRight":
        case "d":
          this.state.right = 0;
      }
    });
    gl.canvas.onclick = function() {
      gl.canvas.requestPointerLock();
    };
    this.mouseListener = gl.canvas.addEventListener("mousemove", (e) => {
      const {movementX, movementY} = e;
      const amount = 0.1;
      this.state.du = linearInterpolation(this.state.du, movementX, amount);
      this.state.dv = linearInterpolation(this.state.dv, movementY, amount);
    });
    gl.canvas.requestPointerLock();
  }
  updateDirection() {
    const velFactor = 0.01;
    const {du, dv} = this.state;
    this.state.u += du * velFactor;
    this.state.v += dv * velFactor;
    if (this.state.v > 1)
      this.state.v = 1;
    if (this.state.v < -0.5)
      this.state.v = -0.5;
    let transform = mat4.create();
    rotateMat(transform, -this.state.v, this.side);
    rotateMat(transform, -this.state.u, this.up);
    const dir = vec3.fromValues(this.initialDirection[0], this.initialDirection[1], this.initialDirection[2]);
    vec3.transformMat4(dir, dir, transform);
    const frictionFactor = 0.5;
    this.state.du *= frictionFactor;
    this.state.dv *= frictionFactor;
    this.direction = dir;
  }
  updatePostion() {
    const {fwd, right} = this.state;
    const velFactor = 0.1;
    let forwardVec = vec3.normalize(vec3.create(), this.direction);
    let rightVec = vec3.cross(vec3.create(), this.direction, this.up);
    vec3.normalize(rightVec, rightVec);
    vec3.scale(forwardVec, forwardVec, fwd * velFactor);
    vec3.scale(rightVec, rightVec, right * velFactor);
    vec3.add(this.position, this.position, forwardVec);
    vec3.add(this.position, this.position, rightVec);
  }
  update(gl) {
    console.log("uv", this.state.u, this.state.v);
    console.log("dudv", this.state.du, this.state.dv);
    this.updateDirection();
    this.updatePostion();
    gl.setView(this.getViewMatrix());
  }
  getViewMatrix() {
    const target = vec3.add(vec3.create(), this.position, this.direction);
    return mat4.lookAt(mat4.create(), this.position, target, this.up);
  }
  clean() {
    document.removeEventListener("keyup", this.keyUpListener);
    document.removeEventListener("keydown", this.keyDownListener);
    document.removeEventListener("mousemove", this.mouseListener);
    document.exitPointerLock();
  }
}
function rotateMat(mat, angle, axis) {
  let newMat = mat4.fromRotation(mat4.create(), angle, axis);
  return mat4.multiply(mat, newMat, mat);
}
function linearInterpolation(start, end, amount) {
  return (1 - amount) * start + amount * end;
}
