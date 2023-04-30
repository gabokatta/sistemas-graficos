import { vec3 } from "gl-matrix";

export abstract class Curve  {

    controlPoints: vec3[];
    level: CurveLevel;
    segments: Segment[];
    B: Function[] = [];
    dB: Function[]  = [];

    constructor(points: vec3[], level: CurveLevel) {
        this.controlPoints = points;
        this.level = level;
        this.segments = this.buildSegments();
    }

    //TODO: Search creation restrictions for each type of curve and level.
    //TODO: make normal (convexity) computing configurable per segment.

    draw(ctx: CanvasRenderingContext2D):void {
        this.segments.forEach((s) => {
            s.drawOnCanvas(ctx, true);
        });
    }

    buildSegments(): Segment[] {
        this.validateControlPoints();
        let segments: Segment[] = [];
        let segAmount = this.getSegmentAmount();
        for (let i = 0; i < segAmount; i++) {
          let points = this.segmentPoints(i);
          segments.push(new Segment(points, this)); 
        }
        return segments;
    }

    abstract getSegmentAmount(): number;
    abstract segmentPoints(segment: number): vec3[]

    validateControlPoints(): void {
        const n = this.controlPoints.length;
        let valid = this.level == CurveLevel.CUADRATIC 
        ? (n >= 3 && (n - 1) % 2 === 0) 
        : (n >= 4 && (n - 1) % 3 === 0);
        if (!valid) {
            throw new Error("Invalid amount of control points.");
        }
      }

}


export class Segment {

    controlPoints: vec3[];
    convexity: number;
    curve: Curve;

    constructor(points: vec3[] = [], curve: Curve, convexity: number = -1) {
        this.controlPoints = points;
        this.convexity = convexity;
        this.curve = curve;
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, showQuad: boolean, delta: number = 0.01, width: number = 2): void {

        let p = [this.controlPoints[0], this.controlPoints[1], this.controlPoints[2]];
        if (this.curve.level == CurveLevel.CUBIC){
            p.push(this.controlPoints[3]);
        }
        ctx.lineWidth = width;

        if (showQuad) {
            ctx.beginPath();
            ctx.strokeStyle = "#FF9900";
            ctx.moveTo(p[0][0], p[0][1]);
            ctx.lineTo(p[1][0], p[1][1]);
            ctx.lineTo(p[2][0], p[2][1]);
            if (this.curve.level == CurveLevel.CUBIC) ctx.lineTo(p[3][0], p[3][1]);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.strokeStyle = "#000";
        for (let u = 0; u <= 1.001; u += delta) {
            const p: vec3 = this.getPoint(u);
            ctx.lineTo(p[0], p[1]);
        }   
        ctx.stroke();
    }

    evaluate(u: number): {point: vec3, normal: vec3, binormal: vec3, tangent: vec3} {
        let tangent: vec3 = this.getTangent(u);
        let normal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), tangent, vec3.fromValues(0,0,this.convexity)));
        let binormal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), tangent, normal));
        return {
            point: this.getPoint(u),
            tangent: tangent,
            normal: normal,
            binormal: binormal
        }
    }

    getPoint(u: number) {
        return this.applyBases(u, this.curve.B, this.curve.level);
    }

    getTangent(u: number) {
        return vec3.normalize(vec3.create(), this.applyBases(u, this.curve.dB, this.curve.level));
    }

    getLength(delta:number = 0.1): number {
        let length = 0;
        for (let u = 0; u < 1 - delta; u += delta){
            let curr_p = this.getPoint(u);
            let next_p = this.getPoint(u+delta);
            length += vec3.dist(curr_p, next_p);
        }
        return length;
    }

    applyBases(u: number, bases: Function[], level: CurveLevel): vec3{
        let x, y, z;
        let p0 = this.controlPoints[0];
        let p1 = this.controlPoints[1];
        let p2 = this.controlPoints[2];
        if (level === CurveLevel.CUADRATIC) {
            x = bases[0](u)*p0[0] + bases[1](u)*p1[0] + bases[2](u)*p2[0];
            y = bases[0](u)*p0[1] + bases[1](u)*p1[1] + bases[2](u)*p2[1];
            z = bases[0](u)*p0[2] + bases[1](u)*p1[2] + bases[2](u)*p2[2];
        }
        else {
            let p3 = this.controlPoints[3];
            x = bases[0](u)*p0[0] + bases[1](u)*p1[0] + bases[2](u)*p2[0] + bases[3](u)*p3[0];
            y = bases[0](u)*p0[1] + bases[1](u)*p1[1] + bases[2](u)*p2[1] + bases[3](u)*p3[1];
            z = bases[0](u)*p0[2] + bases[1](u)*p1[2] + bases[2](u)*p2[2] + bases[3](u)*p3[2];
        }
        return vec3.fromValues(x,y,z);
    }

}

export enum CurveLevel {
    CUADRATIC = 2,
    CUBIC = 3
}


