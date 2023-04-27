import { vec3 } from "gl-matrix";
import { buildBuffers, buildIndex, Geometry } from "../geometry";
import { DrawMethod, WebGL } from "../webgl";

export class Cylinder implements Geometry {

    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];

    covers: {
        position: number[], 
        index: number[], 
        normal: number[]
    }[] = [];

    rows: number;
    cols: number;
    height: number;
    radius: number;

    constructor(rows: number, cols: number, radius: number, height: number) {
        this.rows = rows;
        this.cols = cols;
        this.radius = radius;
        this.height = height;

        buildBuffers(this);
        buildIndex(this);
        this.buildCovers();
    };

    buildCovers() {
        this.covers.push(fillTop(this), fillBottom(this));
    }
    
    getNormals(alfa: number, beta: number): vec3 {
        const x = Math.cos(beta * 2 * Math.PI);
        const y = Math.sin(beta * 2 * Math.PI);
        const z = 0;
      
        return vec3.normalize(vec3.create(), vec3.fromValues(x, y, z));
    }

    getPosition(alfa: number, beta: number): vec3 {
        const x = this.radius * Math.cos(2 * Math.PI * beta);
        const y = this.height * alfa - this.height / 2;
        const z = this.radius * Math.sin(2 * Math.PI * beta);
        return vec3.fromValues(x, y, z);
    }

    draw(gl: WebGL): void {
        gl.draw(this.position, this.index, this.normal);
        this.covers.forEach((c) => {
            gl.draw(c.position, c.index, c.normal, DrawMethod.Fan);
        })
    }
    
}

function fillBottom(cylinder:  Cylinder): {position: number[], index: number[], normal: number[]} {
    var bottom:  {position: number[], index: number[], normal: number[]}  = {position: [], index: [], normal: []};

    const center: vec3 = [0, -cylinder.height / 2 ,0];
    bottom.position.push(...center);
    const bottomCenterIndex = bottom.position.length;
    
    for (let j = 0; j <= cylinder.cols; j++) {
        const beta = j / cylinder.cols;
        const position: vec3 = cylinder.getPosition(1, beta);
        bottom.position.push(...position)
        bottom.normal.push(0,1,0);
    }

    for (let j = 0; j <= cylinder.cols; j++) {
        bottom.index.push(bottomCenterIndex, j+1, j);
    }
    bottom.index.push(bottomCenterIndex, 0, cylinder.cols);

    return bottom;
}

function fillTop(cylinder: Cylinder): {position: number[], index: number[], normal: number[]} {
    var top:  {position: number[], index: number[], normal: number[]}  = {position: [], index: [], normal: []};

    const center: vec3 = [0, cylinder.height / 2 , 0];
    top.position.push(...center);
    const topCenterIndex = top.position.length;
    
    for (let j = 0; j <= cylinder.cols; j++) {
        const beta = j / cylinder.cols;
        const position: vec3 = cylinder.getPosition(0, beta);
        top.position.push(...position)
        top.normal.push(0,-1,0);
    }

    for (let j = 0; j <= cylinder.cols; j++) {
        top.index.push(topCenterIndex, j+1,j);
    }
    top.index.push(topCenterIndex, 0, cylinder.cols);

    return top;
}