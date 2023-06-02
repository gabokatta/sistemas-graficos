export class OrbitalState {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.u = 0;
    this.v = 0;
    this.du = 0;
    this.dv = 0;
    this.dz = 0;
  }
  initial() {
    return new OrbitalState();
  }
}
export class DroneState {
  constructor() {
    this.fwd = 0;
    this.right = 0;
    this.u = 0;
    this.v = 0;
    this.du = 0;
    this.dv = 0;
  }
  initial() {
    return new DroneState();
  }
}
