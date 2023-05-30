import { vec3 } from "gl-matrix";
import { Bezier } from "../../scripts/curves/bezier";
import { CurveLevel } from "../../scripts/curves/curve";
import { Object3D, Transformation } from "../../scripts/object";
import { Path } from "../../scripts/sweep/path";
import { SweepSurface } from "../../scripts/sweep/sweep";
import { params } from "../scene";
import { Box } from "../../scripts/prefabs/box";


export class Boat {



    private static getSpoiler(): Object3D {

        let base = new Object3D(new Box(6,3.5,1.2), [
            Transformation.translate([-4,-5,-1])
        ], params.boat.spoilerColor);
        let top =  new Object3D(new Box(7,1,2.4), [
            Transformation.translate([-4,-5,-3])
        ], params.boat.spoilerColor);

        let spoiler = new Object3D(undefined, [], []);
        spoiler.setChildren([base, top]);

        return spoiler
    }

    private static getRaft(): Object3D {
        let path: Bezier =  new Bezier(
            [
                [0, -7.5 , 0],
                [0,0,0],
                [0, 10 , 0],
            ],
            CurveLevel.CUADRATIC
        );

        let shape: Bezier =  new Bezier([

            vec3.fromValues(0, 0, 0),
            vec3.fromValues(8, 0, 0),
            vec3.fromValues(8, 0, 0),
            vec3.fromValues(8, 0, 0),

            vec3.fromValues(8, 4, 0),
            vec3.fromValues(4, 4, 0),
            vec3.fromValues(4, 4, 0),
            vec3.fromValues(4, 4, 0),

            vec3.fromValues(0, 4, 0),
            vec3.fromValues(0, 0, 0),
            vec3.fromValues(0, 0, 0),
            vec3.fromValues(0, 0, 0),

            vec3.fromValues(0, 0, 0),
        ], CurveLevel.CUBIC)

        shape.changeBinormalDirection([0,1,2], [0,0,-1])

        let sweepable = new Path(shape, path);
        let geometry = new SweepSurface(sweepable);

        let raft = new Object3D(geometry, [], params.boat.raftColor);

        return raft;
    }

    private static getBoxes() {

        let boxes: Object3D[] = [];
        for (let i = 0; i <= 12; i++) {
            boxes.push(new Object3D(new Box(2,2,5), [
                Transformation.translate(params.boat.boxPositions[i]),
                Transformation.scale([0.35,0.35,0.35])
            ], 
            params.boat.boxColors[i]))
        }

        let boxGroup = new Object3D(undefined, [], []);
        boxGroup.setChildren([...boxes]);

        return boxGroup;
    }

    static build(): Object3D {
        let boat =  new Object3D(undefined, [
            Transformation.rotation(to_rads(90), [1,0,0]),
            Transformation.translate(params.boat.position)
        ], []);
        boat.setChildren([
            Boat.getRaft(),
            Boat.getSpoiler(),
            Boat.getBoxes()
        ])
        return boat;
    }


}

function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}