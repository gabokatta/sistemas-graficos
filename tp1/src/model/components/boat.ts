import { Bezier } from "../../scripts/curves/bezier";
import { BSpline } from "../../scripts/curves/bspline";
import { CurveLevel } from "../../scripts/curves/curve";
import type { Geometry } from "../../scripts/geometry";
import { Object3D } from "../../scripts/object";
import { Path } from "../../scripts/sweep/path";
import { SweepSurface } from "../../scripts/sweep/sweep";
import { params } from "../scene";


export class Boat {

    private static getSpoiler() {
        
    }

    private static getRaft(): Object3D {
        let path: Bezier =  new Bezier(
            [
                [0, -1 / 2 , 0],
                [0,0,0],
                [0, 1 /2 , 0],
            ],
            CurveLevel.CUADRATIC
        );

        let shape: BSpline =  BSpline.straightLines([
            [-1 / 2, -1 / 2, 0],
            [-1 / 2, 1 / 2, 0],
            [1 / 2, 1 / 2, 0],
            [1 / 2, -1 / 2, 0],
            [-1 / 2, -1 / 2, 0],
        ])

        let sweepable = new Path(shape, path);
        let geometry = new SweepSurface(sweepable);

        return new Object3D(geometry, [], params.boat.raftColor);
    }

    private static getBoxes() {

    }

    static build(): Object3D {
        let boat =  new Object3D(undefined, [], []);
        boat.setChildren([Boat.getRaft()])
        return boat;
    }


}