
import { BSpline } from "../curves/bspline";
import { SweepSurface } from "../sweep/sweep";
import { Path } from "../sweep/path";
import { Revolution } from "../sweep/revolution";

export class Cube extends SweepSurface {

    constructor(width: number, height: number = width) {
        let path: BSpline = BSpline.straightLines(
            [
                [0, -width /2 , 0],
                [0, height /2 , 0]
            ]
        )
        let shape:BSpline =  BSpline.straightLines([
            [-width / 2 , height / 2 , 0],
            [width / 2, height / 2 , 0],
            [width / 2, -height / 2 , 0],
            [-width / 2, -height / 2 , 0],
            [-width / 2, height / 2, 0]
        ])
        super(new Path(shape, path));
    }
}