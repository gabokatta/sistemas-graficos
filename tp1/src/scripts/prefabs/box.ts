import { SweepSurface } from "../sweep/sweep";
import { Path } from "../sweep/path";
import { Bezier } from "../curves/bezier";
import { CurveLevel } from "../curves/curve";
import { BSpline } from "../curves/bspline";

export class Box extends SweepSurface {

    constructor(width: number, height: number = width, depth: number = 3) {
        let path: Bezier =  new Bezier(
            [
                [0, -depth / 2 , 0],
                [0,0,0],
                [0, depth /2 , 0],
            ],
            CurveLevel.CUADRATIC
        );



        let shape: BSpline =  BSpline.straightLines([
            [-width / 2, -height / 2, 0],
            [-width / 2, height / 2, 0],
            [width / 2, height / 2, 0],
            [width / 2, -height / 2, 0],
            [-width / 2, -height / 2, 0],
        ])

        super(new Path(shape, path));
    }
}