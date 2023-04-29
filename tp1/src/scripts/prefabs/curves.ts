
export interface Curve  {

    controlPoints: number[];
    segments: number;

    getLength(): number;
    getPoint(): number;
    getNormal(): number;
    getBiNormal(): number;
    getTangent(): number;

}

export class Bezier implements Curve {
    controlPoints: number[];
    segments: number;

    constructor(controlPoints: number[], segments: number) {
        this.controlPoints = controlPoints;
        this.segments = segments;
    }


    getPoint(): number {
        throw new Error("Method not implemented.");
    }
    getNormal(): number {
        throw new Error("Method not implemented.");
    }
    getBiNormal(): number {
        throw new Error("Method not implemented.");
    }
    getTangent(): number {
        throw new Error("Method not implemented.");
    }
    getLength(): number {
        throw new Error("Method not implemented.");
    }
}
export class Spline implements Curve {

    controlPoints: number[];
    segments: number;

    constructor(controlPoints: number[], segments: number) {
        this.controlPoints = controlPoints;
        this.segments = segments;
    }

    getPoint(): number {
        throw new Error("Method not implemented.");
    }
    getNormal(): number {
        throw new Error("Method not implemented.");
    }
    getBiNormal(): number {
        throw new Error("Method not implemented.");
    }
    getTangent(): number {
        throw new Error("Method not implemented.");
    }
    getLength(): number {
        throw new Error("Method not implemented.");
    }
}