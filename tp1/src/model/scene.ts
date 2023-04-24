import { mat4, vec3  } from "gl-matrix";
import { WebGL, DrawMethod } from "../scripts/webgl"

var rotate_angle = -1.57078;

var vertexBuffer: Array<number> = new Array();
var indexBuffer: Array<number> = new Array();
var normalBuffer: Array<number> = new Array();

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();

function getPos(alfa: number , beta: number){

    var r=2;
    var nx=Math.sin(beta)*Math.sin(alfa);
    var ny=Math.sin(beta)*Math.cos(alfa);
    var nz=Math.cos(beta);


    var g=beta%0.5;
    var h=alfa%1;
    var f=1;

    if (g<0.25) f=0.95;
    if (h<0.5) f=f*0.95;
    
    var x=nx*r*f;
    var y=ny*r*f;
    var z=nz*r*f;

    return [x,y,z];
}

function getNrm(alfa: number ,beta: number){
    var p=getPos(alfa,beta);
    var v=vec3.create();
    vec3.normalize(v,vec3.fromValues(p[0], p[1], p[2]));

    var delta=0.05;
    var p1=getPos(alfa,beta);
    var p2=getPos(alfa,beta+delta);
    var p3=getPos(alfa+delta,beta);

    var v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
    var v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);

    vec3.normalize(v1,v1);
    vec3.normalize(v2,v2);
    
    var n=vec3.create();
    vec3.cross(n,v1,v2);
    vec3.scale(n,n,-1);
    return n;
}

function animate(){  

    var model: mat4 = gl.modelMatrix;
    var view: mat4 = gl.viewMatrix;
    var normal: mat4 = gl.normalMatrix;

    rotate_angle += 0.05;
    mat4.identity(model);
    mat4.rotate(model,model, rotate_angle, [1.0, 0.0, 1.0]);

    mat4.identity(normal);
    mat4.multiply(normal,view,model);
    mat4.invert(normal,normal);
    mat4.transpose(normal,normal);

    gl.updateMatrices(model, view, normal);
}

function tick(){
    requestAnimationFrame(tick);
    gl.draw(vertexBuffer, indexBuffer, normalBuffer);
    animate();
}

function setBuffers() {
    var pos=[];
    var normal=[];
    var r=2;
    var rows=128;
    var cols=256;

    for (var i=0;i<rows;i++){
        for (var j=0;j<cols;j++) {

            var alfa=j/(cols-1)*Math.PI*2;
            var beta=(0.1+i/(rows-1)*0.8)*Math.PI;

            var p=getPos(alfa,beta);

            pos.push(p[0]);
            pos.push(p[1]);
            pos.push(p[2]);

            var n=getNrm(alfa,beta);

            normal.push(n[0]);
            normal.push(n[1]);
            normal.push(n[2]);
        }
    }

    var index=[];

    for (var i=0;i<rows-1;i++){
         index.push(i*cols);
         for (var j=0;j<cols-1;j++){
            index.push(i*cols+j);
            index.push((i+1)*cols+j);
            index.push(i*cols+j+1);
            index.push((i+1)*cols+j+1);
        }
        index.push((i+1)*cols+cols-1);
    }

    vertexBuffer = pos;
    indexBuffer = index;
    normalBuffer = normal;
}

setBuffers();
tick();
