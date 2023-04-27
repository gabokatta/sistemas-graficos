import { WebGL } from "../scripts/webgl"
import { Sphere } from "../scripts/forms/sphere";
import { Object3D, Transformation } from "../scripts/object";

var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
var gl =  await new WebGL(canvas).init();


function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}

var sonTransforms: Transformation[] = [
    Transformation.translate([3, 4, 0])
]

var sonTransforms2: Transformation[] = [
    Transformation.translate([-3, 4, 0])
]

var sonTransforms3: Transformation[] = [
    Transformation.rotation(to_rads(60), [0,0,1]),
    Transformation.translate([0, 0, 4.5])
]

// TODO: Cuando escalo el objeto a 0.5 por ejemplo, las normales parecen ser afectadas, porque cambia el color.
// TODO: Tras cierto numero de rows/columns, se achatan las esferas. Ej: 300

var sonSphere3 = new Object3D(new Sphere(100,100, 0.5), sonTransforms3, []);
var sonSphere2 = new Object3D(new Sphere(100,100, 2), sonTransforms2, []);
var sonSphere = new Object3D(new Sphere(100,100, 2), sonTransforms, []);

var sphere = new Object3D(new Sphere(100,100, 4), [
    Transformation.rotation(to_rads(25), [0,-1,0]),
    Transformation.scale([0.4,0.4,0.4]), 
    Transformation.translate([0,-1,0])
], 
[]
);
sphere.setChildren([sonSphere, sonSphere2, sonSphere3]);
sphere.draw(gl);
