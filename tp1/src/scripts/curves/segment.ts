import { vec3 } from "gl-matrix";
import { Curve, CurveLevel } from "./curve";

export const DEFAULT_DELTA: number = 0.01;

export class Segment {

    controlPoints: vec3[];
    convexity: Function;
    curve: Curve;
    length: number = 0;

    constructor(points: vec3[] = [], curve: Curve, convexity: Function = Convexity.convex) {
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

    evaluate(u: number, delta: number = DEFAULT_DELTA): {point: vec3, normal: vec3, binormal: vec3, tangent: vec3} {
        let tangent: vec3 = vec3.normalize(vec3.create(), this.getTangent(u));
        let binormal = vec3.normalize(vec3.create(), this.getBinormal(u, delta, tangent));
        let normal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), binormal, tangent));

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

    getBinormal(u: number, delta: number, tangent: vec3) {
        let current = this.getPoint(u);
        let next =  this.getPoint(u + delta);
        let vector = vec3.sub(vec3.create(), current, next);
        vec3.scale(vector, vector, this.convexity(u));
        return vec3.cross(vec3.create(), tangent, vector);
    }

    getLength(delta:number): number {
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

export class Convexity {
    static convex = (u: number) => {
        return 1;
    }
    static concave = (u: number) => {
        return -1;
    }
    static concaveUntil = (treshold: number) => (u: number) => {
        return u >= treshold ? 1 : -1;
    }
    static convexUntil = (treshold: number) => (u: number) => {
        return u >= treshold ? -1 : 1;
    }
    static concaveFrom = (treshold: number) => (u: number) => {
        return u <= treshold ? -1 : 1;
    }
    static convexFrom = (treshold: number) => (u: number) => {
        return u <= treshold ? 1 : -1;
    }
}