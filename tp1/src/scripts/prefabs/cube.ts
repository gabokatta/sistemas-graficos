import { buildBuffers, buildIndex,  Geometry } from "../geometry";
import type { WebGL } from "../webgl";
import { BSpline } from "../curves/bspline";
import { Surface, SweepSurface } from "../sweep";

export class Cube implements Geometry {

    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];

    covers: {
        position: number[], 
        index: number[], 
        normal: number[]
    }[] = [];

    rows: number = 75;
    cols: number = 75;

    width: number;
    height: number;
    sweep: SweepSurface;

    constructor(width: number, height: number = width) {
        this.width = width;
        this.height = height;

        let path: BSpline = BSpline.straightLines(
            [
                [0, -width /2 , 0],
                [0, height /2 , 0]
            ]
        )

        let shape:BSpline =  BSpline.straightLines([
            [-width / 2 , -width / 2 , 0],
            [-height / 2, width / 2 , 0],
            [width / 2, height / 2, 0],
            [width / 2, -height / 2, 0],
            [-width / 2, -width / 2, 0]
        ])

        let surface = new Surface(shape);
        this.sweep = new SweepSurface(surface, path);

        buildBuffers(this);
        buildIndex(this);
    }
    
    
    getPointData(alfa: number, beta: number) {

        let {p, n} =  this.sweep.getPointData(alfa, beta);
        return {p, n};
    }

    draw(gl: WebGL): void {
        this.sweep.draw(gl);
    }
    
}