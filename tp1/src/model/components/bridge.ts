import { vec3 } from "gl-matrix";
import { Bezier } from "../../scripts/curves/bezier";
import { Curve, CurveLevel } from "../../scripts/curves/curve";
import { Path } from "../../scripts/sweep/path";
import { SweepSurface, Sweepable } from "../../scripts/sweep/sweep";
import { Object3D, Transformation } from "../../scripts/object";
import { params } from "../scene";
import { Revolution } from "../../scripts/sweep/revolution";

let roadSweep: Sweepable;

export class Bridge {

    static getTensors() {
        
    }

    static getRopes(radius: number = 0.35) {

        let {h1, h2} = params.bridge.values;
        let bridgeLenght = params.bridgeLenght;


        let ropeBase = (bridgeLenght/2) - params.ropesOffset;
        let ropeBaseEnd = (bridgeLenght/2) + params.ropesOffset;

        let firstTowerX = (bridgeLenght/2) - params.towerOffset;
        let secondTowerX = (bridgeLenght/2) + params.towerOffset;

        let roadHeight = getRoadPosition(bridgeLenght/2, roadSweep.getPath()).p[2];

        let ropeBaseOffset = (h1*0.15);
        let ropeBaseHeight = getRoadPosition(ropeBase, roadSweep.getPath()).p[2] - ropeBaseOffset ;

        let towerYOffset = (h1*0.7);
        let towerY = -1*(h2 - 10 - getRoadPosition(firstTowerX, roadSweep.getPath()).p[2]) + towerYOffset;


        // TODO: Debug bridge and ropes, make dynamic.

        let pathPoints = [
            vec3.fromValues(-1.5, ropeBase, ropeBaseHeight),
            vec3.fromValues(-1.5, firstTowerX, towerY + 10),
            vec3.fromValues(-1.5, firstTowerX, towerY),

            vec3.fromValues(-1.5, firstTowerX, towerY),

            vec3.fromValues(-1.5, (bridgeLenght / 2) - 15, roadHeight),
            vec3.fromValues(-1.5, (bridgeLenght / 2) + 15, roadHeight),
            vec3.fromValues(-1.5, secondTowerX, towerY),

            vec3.fromValues(-1.5, secondTowerX, towerY),
            vec3.fromValues(-1.5, secondTowerX, towerY + 10),
            vec3.fromValues(-1.5, ropeBaseEnd, ropeBaseHeight),
        ];
        let path: Bezier =  new Bezier(pathPoints, CurveLevel.CUBIC);

        let rightPathPoints: vec3[] = JSON.parse(JSON.stringify(pathPoints));
        rightPathPoints.forEach((p) => {
            p[0] *= -1;
        })
        let rightRopePath: Bezier =  new Bezier(rightPathPoints, CurveLevel.CUBIC);

        
        let shape: Bezier =  new Bezier([
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,0),

            vec3.fromValues(0,radius,0),
            
            vec3.fromValues(radius,radius,0),
            vec3.fromValues(radius,radius,0),
            vec3.fromValues(radius,radius,0),

            vec3.fromValues(2*radius,radius,0),

            vec3.fromValues(2*radius,0,0),
            vec3.fromValues(2*radius,0,0),
            vec3.fromValues(2*radius,0,0),

            vec3.fromValues(2*radius, -radius,0),

            vec3.fromValues(radius,-radius,0),
            vec3.fromValues(radius,-radius,0),
            vec3.fromValues(radius,-radius,0),

            vec3.fromValues(0, -radius,0),

            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,0),

            vec3.fromValues(0,radius,0),
            
            vec3.fromValues(radius,radius,0),
            vec3.fromValues(radius,radius,0),
            vec3.fromValues(radius,radius,0),
        ], CurveLevel.CUADRATIC)


        let leftSweepable = new Path(shape, path);
        let leftGeometry = new SweepSurface(leftSweepable);

        let rightSweepable = new Path(shape, rightRopePath);
        let rightGeometry = new SweepSurface(rightSweepable);

        let ropes = [
            new Object3D(leftGeometry, [
                Transformation.translate([1, 0, 0])
            ], params.bridge.ropeColor),
            new Object3D(rightGeometry, [
                Transformation.translate([-28, 0, 0])
            ], params.bridge.ropeColor)
        ];

        return ropes;

    }

    static getRoad(length: number = 500) {

        let {h1} = params.bridge.values;
        h1 *= -1;

        let bumpStart = length / 4
        let bumpPeak = length / 2;
        let bumpEnd = bumpPeak + bumpStart;

        let startBumpSupport = (bumpStart+bumpPeak) / 2
        let endBumpSupport = (bumpEnd+bumpPeak) / 2

        let path: Bezier =  new Bezier(
            [
                [0, 0 , 0],
                [0,  0 , 0],
                [0,  0 , 0],
                [0,  bumpStart , 0],

                [0, bumpStart + 2,  0], // 5 == h1
                [0, startBumpSupport,  h1],

                [0, bumpPeak, h1], 

                [0, endBumpSupport, h1],  
                [0, bumpEnd - 2, 0],

                [0, bumpEnd, 0],
                [0, length, 0],
                [0, length, 0],
                [0, length, 0]
            ],
            CurveLevel.CUBIC
        );

        let shape: Bezier =  new Bezier([

            vec3.fromValues(0, 0, 0),

            vec3.fromValues(4, 0, 0),
            vec3.fromValues(4, 0, 0),
            vec3.fromValues(4, 0, 0),

            vec3.fromValues(5, 0, 0),
            vec3.fromValues(5, 1, 0),

            vec3.fromValues(6, 1, 0),
            vec3.fromValues(6, 1, 0),
            vec3.fromValues(6, 1, 0),

            vec3.fromValues(22, 1, 0),
            vec3.fromValues(22, 1, 0),
            vec3.fromValues(22, 1, 0),

            vec3.fromValues(23, 1, 0),
            vec3.fromValues(23, 0, 0),

            vec3.fromValues(24, 0, 0),
            vec3.fromValues(24, 0, 0),
            vec3.fromValues(24, 0, 0),

            vec3.fromValues(28, 0, 0),
            vec3.fromValues(28, 0, 0),
            vec3.fromValues(28, 0, 0),

            vec3.fromValues(28, 2.5, 0),
            vec3.fromValues(28, 2.5, 0),
            vec3.fromValues(28, 2.5, 0),

            vec3.fromValues(0, 2.5, 0),
            vec3.fromValues(0, 2.5, 0),
            vec3.fromValues(0, 2.5, 0),

            vec3.fromValues(0, 0, 0),
            vec3.fromValues(0, 0, 0)
        ], CurveLevel.CUBIC)

        shape.changeBinormalDirection([...Array(shape.segments.length).keys()], [0,0,-1])

        let sweepable = new Path(shape, path);
        let geometry = new SweepSurface(sweepable);

        saveRoadSweep(sweepable);

        geometry.useCovers = false;

        let road = new Object3D(geometry, [
            Transformation.rotation(to_rads(90), [1,0,0]),
            Transformation.translate(params.bridge.road.position),
        ], params.bridge.road.color);

        road.setChildren([...this.getRopes()])

        return road;
    }

    static getTowers(): Object3D[] {

        let {h2} = params.bridge.values;
        let height = h2/3

        let radiuses: number[] = [3, 2, 1.25];
        let lengths: number[] = [height, height*2, height*3];

        let points = [
            // Origen al radio 1.
            vec3.fromValues(0,0,0),
            vec3.fromValues(radiuses[0], 0, 0),
            vec3.fromValues(radiuses[0], 0, 0),
            vec3.fromValues(radiuses[0], 0, 0),

            // radio 1 hasta altura 1.
            vec3.fromValues(radiuses[0], 0, 0),
            vec3.fromValues(radiuses[0], lengths[0], 0),
            vec3.fromValues(radiuses[0], lengths[0], 0),
            vec3.fromValues(radiuses[0], lengths[0], 0),

            // curva transitoria a radio 2.
            vec3.fromValues(radiuses[0], lengths[0], 0),
            vec3.fromValues(radiuses[0], lengths[0] + 1, 0),
            vec3.fromValues(radiuses[1], lengths[0] + 1, 0),
            vec3.fromValues(radiuses[1], lengths[0] + 2, 0),

            // radio 2 hasta altura 2.
            vec3.fromValues(radiuses[1], lengths[0] + 1, 0),
            vec3.fromValues(radiuses[1], lengths[1], 0),
            vec3.fromValues(radiuses[1], lengths[1], 0),
            vec3.fromValues(radiuses[1], lengths[1], 0),

            // curva transitoria a radio 3.
            vec3.fromValues(radiuses[1], lengths[1], 0),
            vec3.fromValues(radiuses[1], lengths[1] + 1, 0),
            vec3.fromValues(radiuses[2], lengths[1] + 1, 0),
            vec3.fromValues(radiuses[2], lengths[1] + 2, 0),

            // radio 3 hasta altura 3.
            vec3.fromValues(radiuses[2], lengths[1] + 1, 0),
            vec3.fromValues(radiuses[2], lengths[2], 0),
            vec3.fromValues(radiuses[2], lengths[2], 0),
            vec3.fromValues(radiuses[2], lengths[2], 0),

            // Cerramos tapa.
            vec3.fromValues(0, lengths[2], 0),
            vec3.fromValues(0,lengths[2],0),
            vec3.fromValues(0,lengths[2],0),
            vec3.fromValues(0,lengths[2],0)
        ]
        
        let shape = new Bezier(points, CurveLevel.CUBIC);

        shape.changeBinormalDirection([...Array(shape.segments.length).keys()], [0,0,-1])

        let towers = [];
        for (let p of params.bridge.towers.positions) {
            let t = new SweepSurface(new Revolution(shape))
            towers.push(new Object3D(t, [Transformation.translate(p)], params.bridge.towers.color))
        }

        return towers;
    }

    static build() {
        let bridge =  new Object3D(undefined, [
            Transformation.translate([-10,0,-20])
        ], []);
        bridge.setChildren([
            this.getRoad(params.bridgeLenght),
            ...this.getTowers()
        ])
        return bridge;
    }


}

function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}

function saveRoadSweep(sweep: Sweepable) {
    roadSweep = sweep;
}

function getRoadPosition(position: number, path: Curve): any {
    let normalized  = position / path.length;
    return path.getPointData(normalized);
}