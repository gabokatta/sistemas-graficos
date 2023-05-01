import {Convexity, Segment} from "./segment.js";
export class Curve {
  constructor(points, level) {
    this.length = 0;
    this.B = [];
    this.dB = [];
    this.controlPoints = points;
    this.level = level;
    this.segments = this.buildSegments();
  }
  draw(ctx) {
    this.segments.forEach((s) => {
      s.drawOnCanvas(ctx, true);
    });
  }
  getPointData(u) {
    const {segment, localU} = this.coordToSegment(u);
    return segment.evaluate(localU);
  }
  buildSegments() {
    this.validateControlPoints();
    let segments = [];
    let segAmount = this.getSegmentAmount();
    for (let i = 0; i < segAmount; i++) {
      let points = this.segmentPoints(i);
      segments.push(new Segment(points, this));
    }
    return segments;
  }
  setConvexities(convexities) {
    if (convexities.length == 0) {
      convexities = Array(this.segments.length).fill(Convexity.convex);
      return;
    } else if (convexities.length != this.segments.length) {
      console.log(this.segments, convexities);
      throw new Error("Convexities should be set for all segments.");
    }
    let i = 0;
    for (let c of convexities) {
      this.segments[i].convexity = c;
      i++;
    }
  }
  coordToSegment(u) {
    let resultSegment = void 0;
    for (let s of this.segments) {
      let globalLength = s.length / this.length;
      if (u <= globalLength) {
        resultSegment = s;
        break;
      }
      u -= globalLength;
    }
    if (resultSegment == void 0) {
      return {segment: this.segments[-1], localU: 1};
    }
    const localU = u / (resultSegment.length / this.length);
    return {segment: resultSegment, localU};
  }
  validateControlPoints() {
    const n = this.controlPoints.length;
    let valid = this.level == CurveLevel.CUADRATIC ? n >= 3 && (n - 1) % 2 === 0 : n >= 4 && (n - 1) % 3 === 0;
    if (!valid) {
      throw new Error("Invalid amount of control points.");
    }
  }
}
export var CurveLevel;
(function(CurveLevel2) {
  CurveLevel2[CurveLevel2["CUADRATIC"] = 2] = "CUADRATIC";
  CurveLevel2[CurveLevel2["CUBIC"] = 3] = "CUBIC";
})(CurveLevel || (CurveLevel = {}));
