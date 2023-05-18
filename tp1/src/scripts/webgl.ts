import { mat4 , vec3 } from "gl-matrix";

const vertexShaderPath = 'dist/shaders/vertex.glsl';
const fragmentShaderPath = 'dist/shaders/fragment.glsl';

export class WebGL {

    public canvas: HTMLCanvasElement;
    public gl: WebGLRenderingContext;
    public program: WebGLProgram;

    public modelMatrix: mat4;
    public viewMatrix: mat4;
    public projMatrix: mat4;
    public normalMatrix: mat4;

    public method: DrawMethod;

    public color: number[];

    public normalColoring: boolean = false;
    public showLines: boolean = false;
    public showSurface: boolean = true;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();
        this.normalMatrix = mat4.create();
        this.method = DrawMethod.Smooth;
        this.color = [0.8,0.8,1]

        if (!canvas) throw Error("Your browser does not support WebGL");
        this.gl = canvas.getContext("webgl")!;
        this.program = this.gl.createProgram()!;

        this.cleanGL();
    };

    cleanGL() {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0.1, 0.1, 0.2, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    };

    async init(vertexShader = vertexShaderPath, fragmentShader = fragmentShaderPath) {
        await this.setUpShaders(vertexShader, fragmentShader);
        this.setUpMatrices();
        this.cleanGL();
        this.setColor(this.color);
        this.setNormalColoring(this.normalColoring);
        return this;
    }

    setUpMatrices() {
        mat4.perspective(this.projMatrix, 45, this.canvas.width / this.canvas.height, 0.1, 100.0);
        
        mat4.identity(this.viewMatrix);
        mat4.translate(this.viewMatrix, this.viewMatrix, [0.0, 0.0, -10.0]);

        this.setMatrixUniforms();
    };

    setMatrixUniforms() {
        this.setMatrix("modelMatrix", this.modelMatrix);
        this.setMatrix("viewMatrix", this.viewMatrix);
        this.setMatrix("normalMatrix", this.normalMatrix);
        this.setMatrix("projMatrix", this.projMatrix);
    }

    async setUpShaders(vertexFile: string, fragmentFile: string) {
        const [vertex, fragment] = await Promise.all([
           fetch(vertexFile).then(handleResponse),
           fetch(fragmentFile).then(handleResponse)
        ]);

        const vertexShader = makeShader(this.gl, vertex, this.gl.VERTEX_SHADER);
        const fragmentShader = makeShader(this.gl, fragment, this.gl.FRAGMENT_SHADER);

        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error("Unable to initialize the shader program.");
        }

        this.gl.useProgram(this.program);
    }

    draw(vertex: Array<number>, index: Array<number>, normals: Array<number>, method: DrawMethod = this.method) {
        this.setMatrixUniforms();
        const vertexBuffer = this.createBuffer(vertex);
        const normalBuffer = this.createBuffer(normals);
        const indexBuffer = this.createIndexBuffer(index);

        this.setAttribute(vertexBuffer, 3 , "aVertexPosition");
        this.setAttribute(normalBuffer, 3 , "aVertexNormal");
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        if (this.showSurface) this.gl.drawElements(method, index.length, this.gl.UNSIGNED_SHORT, 0);
        if (this.showLines) {
            this.setDrawColor([0.4, 0.4, 0.4]);
            this.gl.drawElements(this.gl.LINE_STRIP, index.length, this.gl.UNSIGNED_SHORT, 0);
            this.setDrawColor(this.color);
        }
    }

    drawVec(p: number[], dir: number[], len: number , normals: number[] = [0,0,0,0,0,0]) {
        let dirNorm = vec3.normalize(vec3.create(), vec3.fromValues(dir[0],dir[1],dir[2]));
        vec3.scale(dirNorm, dirNorm, len)
        let p2 = vec3.add(vec3.create(), 
        vec3.fromValues(p[0],p[1],p[2]), 
        vec3.fromValues(dirNorm[0],dirNorm[1],dirNorm[2]));
        this.drawLine(vec3.fromValues(p[0],p[1],p[2]), p2, normals);
    }

    drawLine(p1: vec3, p2: vec3, normals: number[] = [0,0,0,0,0,0]) {
        this.draw([...p1, ...p2], [0,1], normals, DrawMethod.Lines)
    }

    // Utility Methods

    setDrawMethod(method: DrawMethod) {
        this.method = method;
    }

    setAttribute(buffer: WebGLBuffer, size: number, name: string) {
        const attributeLocation = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(attributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.vertexAttribPointer(attributeLocation, size, this.gl.FLOAT, false, 0 , 0); 
    }

    setColor(color: number[]) {
        this.color = color;
        this.setDrawColor(this.color);
      }

    setDrawColor(color: number[]) {
        const modelColor = color.length == 0 ? [1.0, 0, 1.0] : color;
    
        const colorUniform = this.gl.getUniformLocation(
          this.program,
          "modelColor"
        );
        this.gl.uniform3fv(colorUniform, vec3.fromValues(modelColor[0], modelColor[1], modelColor[2]));
    }

    setNormalColoring(bool: boolean) {
        this.normalColoring = bool;
        const normalColoringUniform = this.gl.getUniformLocation(
          this.program,
          "normalColoring"
        );
        this.gl.uniform1i(normalColoringUniform, Number(bool));
        return this;
      }

    setView(view: mat4) {
        this.viewMatrix = view;
        this.setMatrix("viewMatrix", view);
    }

    setModel(model: mat4) {
        this.modelMatrix = model;
        this.setMatrix("modelMatrix", model);
        this.setNormal();
    }

    setNormal() {
        var normal = this.normalMatrix;
        var model = this.modelMatrix;
        var view = this.viewMatrix;

        mat4.identity(this.normalMatrix);
        mat4.multiply(normal,view,model);
        mat4.invert(normal,normal);
        mat4.transpose(normal,normal);

        this.normalMatrix = normal;
        this.setMatrix("normalMatrix", normal);
    }

    setMatrix(name: string, matrix: mat4) {
        var matrixUniform: WebGLUniformLocation = this.gl.getUniformLocation(this.program, name)!;
        this.gl.uniformMatrix4fv(matrixUniform, false, matrix);
    }

    createBuffer(array: Array<number>): WebGLBuffer {
        const buffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(array), this.gl.STATIC_DRAW);
        return buffer!;
    };

    createIndexBuffer(index: Array<number>): WebGLBuffer {
        const buffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), this.gl.STATIC_DRAW);
        return buffer;
    };

}

function makeShader( gl: WebGLRenderingContext ,src: string, type: GLenum) {
    //compile the vertex shader
    var shader: WebGLShader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

function handleResponse(response: Response) {
    if (!response.ok) throw new Error("Error fetching resource");
    return response.text();
};

export enum DrawMethod {
    Smooth = WebGLRenderingContext.TRIANGLE_STRIP,
    LineStrip = WebGLRenderingContext.LINE_STRIP,
    Fan = WebGLRenderingContext.TRIANGLE_FAN,
    Lines = WebGLRenderingContext.LINES
}


