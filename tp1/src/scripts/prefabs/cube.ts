
import { BSpline } from "../curves/bspline";
import { SweepSurface } from "../sweep/sweep";
import { Path } from "../sweep/path";
import { Bezier } from "../curves/bezier";
import { CurveLevel } from "../curves/curve";

export class Cube extends SweepSurface {

    constructor(width: number, height: number = width) {
        let path: BSpline =  new BSpline(
            [
                [0, -width /2 , 0],
                [0, -width /2 , 0],
                [0, -width /2 , 0],
                [0, height /2 , 0],
                [0, height /2 , 0],
                [0, height /2 , 0],
                [0, height /2 , 0]
            ],
            CurveLevel.CUADRATIC
        );

        let shape: BSpline =  new BSpline(
        [
            [-width / 2 , height / 2 , 0],
            [-width / 2 , height / 2 , 0],
            [-width / 2 , height / 2 , 0],

            [width / 2, height / 2 , 0],
            [width / 2, height / 2 , 0],
            [width / 2, height / 2 , 0],

            [width / 2, -height / 2 , 0],
            [width / 2, -height / 2 , 0],
            [width / 2, -height / 2 , 0],

            [-width / 2, -height / 2 , 0],
            [-width / 2, -height / 2 , 0],
            [-width / 2, -height / 2 , 0],

            [-width / 2 , height / 2 , 0],
            [-width / 2 , height / 2 , 0],
            [width / 2, height / 2 , 0]
        ],
        CurveLevel.CUADRATIC)
        super(new Path(shape, path));
    }
}