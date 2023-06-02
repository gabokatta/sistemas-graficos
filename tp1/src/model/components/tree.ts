import { vec3 } from "gl-matrix";
import { Object3D, Transformation } from "../../scripts/object";
import { Cylinder } from "../../scripts/prefabs/cylinder";
import { params } from "../scene";
import { CurveLevel } from "../../scripts/curves/curve";
import { Revolution } from "../../scripts/sweep/revolution";
import { SweepSurface } from "../../scripts/sweep/sweep";
import { Bezier } from "../../scripts/curves/bezier";
export class Tree {

    static getLeaves(trunkLenght: number){

        let trunkCoverage = randomFromInterval(1, trunkLenght - 2)

        let points = [
            vec3.fromValues(0,5,0),
            vec3.fromValues(3, 3, 0),
            vec3.fromValues(3, 2, 0),
            vec3.fromValues(1.5, 2.5, 0),
            vec3.fromValues(1.5, 1, 0),
            vec3.fromValues(3, 1, 0),
            vec3.fromValues(3, 0, 0),
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,0),   
        ]

        points.slice(1).forEach((p) => p[1] -= trunkCoverage )
        points.forEach((p) => p[1] += trunkLenght / 2 )

        let shape = new Bezier(points, CurveLevel.CUBIC);
        let leafs = new SweepSurface(new Revolution(shape));

        return new Object3D(leafs, [], params.tree.leafColor)
    }

    static getTrunk(length: number) {
        let geometry = new Cylinder(1,length);
        return new Object3D(geometry, [
            Transformation.rotation(to_rads(90), [1,0,0])
        ], params.tree.trunkColor)
    }

    private static getTree(trunkLength: number, pos: number[]) {
        let tree =  new Object3D(undefined, [
            Transformation.translate(pos)
        ], []);
        tree.setChildren([
            Tree.getTrunk(trunkLength),
            Tree.getLeaves(trunkLength)
        ])
        return tree;
    }

    static build(trunkLenght: number = 5) {
        let trees =  new Object3D(undefined, [], []);
        trees.setChildren([
            this.getTree(trunkLenght, [50,10,125]),
            this.getTree(trunkLenght, [50,10,-125]),
        ])
        return trees;
    }


}

function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}

function randomFromInterval(min: number, max: number) {
    return Math.random() * (max - min + 1) + min;
}