import { mat4 } from "gl-matrix";

const vertexShaderPath = new URL("../shaders/vertex.glsl");
const fragmentShaderPath = new URL("../shaders/fragment.glsl");

class WebGL {
    public canvas: HTMLCanvasElement;
    public gl: WebGLRenderingContext;
    public program: WebGLProgram;
    public modelMatrix: mat4;
    public viewMatrix: mat4;
    public projMatrix: mat4;
    public normalMatrix: mat4;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();
        this.normalMatrix = mat4.create();

        if (!canvas) throw Error("Your browser does not support WebGL");
        this.gl = canvas.getContext("webgl")!;
        this.program = this.gl.createProgram()!;

        this.setUpWebGL();
    };

    setUpWebGL() {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0.1, 0.1, 0.2, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    };

    async init() {
        await this.setUpShaders(vertexShaderPath, fragmentShaderPath);
        this.setUpMatrices();
        this.setUpWebGL();
    }

    setUpMatrices() {
        mat4.perspective(this.projMatrix,45, this.canvas.width / this.canvas.height, 0.1, 100.0);
        mat4.identity(this.modelMatrix);
        mat4.rotate(this.modelMatrix, this.modelMatrix, -1.57078, [1.0, 0.0, 0.0]);
        mat4.identity(this.viewMatrix);
        mat4.translate(this.viewMatrix, this.viewMatrix, [0.0, 0.0, -5.0]);
        this.setMatrixUniforms();
    };

    setMatrixUniforms() {
        this.setMatrix("modelMatrix", this.modelMatrix);
        this.setMatrix("viewMatrix", this.viewMatrix);
        this.setMatrix("normalMatrix", this.normalMatrix);
        this.setMatrix("projMatrix", this.projMatrix);
    }

    async setUpShaders(vertexFile: URL, fragmentFile: URL) {
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

    draw(vertex: Array<number>, index: Array<number>, normals: Array<number>, method: DrawMethod = DrawMethod.Smooth) {
        this.setMatrixUniforms();
        const vertexBuffer = this.createBuffer(vertex);
        const normalBuffer = this.createBuffer(normals);
        const indexBuffer = this.createIndexBuffer(index);

        this.setAttribute(vertexBuffer, 3 , "aVertexPosition");
        this.setAttribute(normalBuffer, 3 , "aVertexNormal");

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        switch (method) {
            case DrawMethod.Smooth: {
                this.gl.drawElements(this.gl.TRIANGLE_STRIP, index.length, this.gl.UNSIGNED_SHORT, 0);
                break;
            }
            case DrawMethod.Lines: {
                this.gl.drawElements(this.gl.LINE_STRIP, index.length, this.gl.UNSIGNED_SHORT, 0);
                break;
            }
        }
    }

    // Utility Methods

    setAttribute(buffer: WebGLBuffer, size: number, name: string) {
        const attributeLocation = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(attributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.vertexAttribPointer(attributeLocation, size, this.gl.FLOAT, false, 0 , 0); 
    }

    //TODO: Try to replicate the demo via animating the sphere updating the matrices with setMatrix().

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
        // TODO: Can't find a way to set the indexBuffer itemSize, says property not found.
        const buffer = this.gl.createBuffer()!;
        //buffer.number_vertex_point = index.length;
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

enum DrawMethod {
    Smooth,
    Lines
}


