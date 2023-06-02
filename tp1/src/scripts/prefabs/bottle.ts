import { SweepSurface } from "../sweep/sweep";
import { Bezier } from "../curves/bezier";
import { CurveLevel } from "../curves/curve";
import { Revolution } from "../sweep/revolution";
import { vec3 } from "gl-matrix";

export class Bottle extends SweepSurface {

    constructor(peakRadius: number, bodyRadius: number) {
        let shape: Bezier =  new Bezier([
            vec3.fromValues(0,0,0),
            vec3.fromValues(peakRadius, 0, 0),
            vec3.fromValues(peakRadius, 0, 0),
            vec3.fromValues(peakRadius, 0, 0),
            vec3.fromValues(peakRadius, 2.5, 0),
            vec3.fromValues(peakRadius, 2.5, 0),
            vec3.fromValues(peakRadius, 2.5, 0),

            vec3.fromValues(bodyRadius, 4.5, 0),
            vec3.fromValues(bodyRadius, 4.5, 0),
            vec3.fromValues(bodyRadius, 5,0),
            vec3.fromValues(bodyRadius, 7.5,0),

            vec3.fromValues(bodyRadius, 8,0),
            vec3.fromValues(bodyRadius, 12,0),
            vec3.fromValues(0, 12,0),
            vec3.fromValues(0, 12,0),
            vec3.fromValues(0, 12,0),
        ],
        CurveLevel.CUBIC)
        super(new Revolution(shape));
        this.useCovers = false;
    }
}

