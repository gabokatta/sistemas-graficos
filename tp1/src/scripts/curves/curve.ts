import type { vec3 } from "gl-matrix";
import {  Segment } from "./segment";

export abstract class Curve  {

    controlPoints: vec3[];
    level: CurveLevel;

    segments: Segment[];
    length: number = 0;

    B: Function[] = [];
    dB: Function[]  = [];

    constructor(points: vec3[], level: CurveLevel) { 
        this.controlPoints = points;
        this.level = level;
        this.segments = this.buildSegments();
    }

    //TODO:
    //Try to draw straight lines, see if you need any new support.
    //Make curves webGL compatible.

    draw(ctx: CanvasRenderingContext2D):void {
        this.segments.forEach((s) => {
            s.drawOnCanvas(ctx, true);
        });
    }

    getPointData(u: number): {point: vec3, normal: vec3, binormal: vec3, tangent: vec3} {
        const {segment, localU} = this.coordToSegment(u);
        return segment.evaluate(localU); 
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

    coordToSegment(u: number): {segment: Segment, localU: number} {
        let resultSegment = undefined;
        for (let s of this.segments) {
            let globalLength  = s.length / this.length;
            if (u <= globalLength) {
                resultSegment = s;
                break;
            }
            u -= globalLength;
        }
        if (resultSegment == undefined) {
            return {segment: this.segments[-1], localU: 1};
        }
        const localU = u / (resultSegment.length / this.length);
        return {segment: resultSegment, localU: localU};
    }

    validateControlPoints(): void {
        const n = this.controlPoints.length;
        let valid = this.level == CurveLevel.CUADRATIC 
        ? (n >= 3 && (n - 1) % 2 === 0) 
        : (n >= 4 && (n - 1) % 3 === 0);
        if (!valid) {
            throw new Error("Invalid amount of control points.");
        }
    }

    changeBinormalDirection(segmentIndexes: number[], binormal: vec3) {
        for (let index of segmentIndexes){
            this.segments[index].binormal = binormal;
        }
    }

    abstract getSegmentAmount(): number;
    abstract segmentPoints(segment: number): vec3[]

}


export enum CurveLevel {
    CUADRATIC = 2,
    CUBIC = 3
}


