import {mat4} from "../../snowpack/pkg/gl-matrix.js";
const vertexShaderPath = "../dist/shaders/vertex.glsl";
const fragmentShaderPath = "../dist/shaders/fragment.glsl";
export class WebGL {
  constructor(canvas) {
    this.canvas = canvas;
    this.modelMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    this.projMatrix = mat4.create();
    this.normalMatrix = mat4.create();
    this.method = DrawMethod.Smooth;
    if (!canvas)
      throw Error("Your browser does not support WebGL");
    this.gl = canvas.getContext("webgl");
    this.program = this.gl.createProgram();
    this.cleanGL();
  }
  cleanGL() {
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0.1, 0.1, 0.2, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  async init(vertexShader = vertexShaderPath, fragmentShader = fragmentShaderPath) {
    await this.setUpShaders(vertexShader, fragmentShader);
    this.setUpMatrices();
    this.cleanGL();
    return this;
  }
  setUpMatrices() {
    mat4.perspective(this.projMatrix, 45, this.canvas.width / this.canvas.height, 0.1, 100);
    mat4.identity(this.viewMatrix);
    mat4.translate(this.viewMatrix, this.viewMatrix, [0, 0, -10]);
    this.setMatrixUniforms();
  }
  setMatrixUniforms() {
    this.setMatrix("modelMatrix", this.modelMatrix);
    this.setMatrix("viewMatrix", this.viewMatrix);
    this.setMatrix("normalMatrix", this.normalMatrix);
    this.setMatrix("projMatrix", this.projMatrix);
  }
  async setUpShaders(vertexFile, fragmentFile) {
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
  draw(vertex, index, normals, method = this.method) {
    this.setMatrixUniforms();
    const vertexBuffer = this.createBuffer(vertex);
    const normalBuffer = this.createBuffer(normals);
    const indexBuffer = this.createIndexBuffer(index);
    this.setAttribute(vertexBuffer, 3, "aVertexPosition");
    this.setAttribute(normalBuffer, 3, "aVertexNormal");
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.drawElements(this.method, index.length, this.gl.UNSIGNED_SHORT, 0);
  }
  setDrawMethod(method) {
    this.method = method;
  }
  setAttribute(buffer, size, name) {
    const attributeLocation = this.gl.getAttribLocation(this.program, name);
    this.gl.enableVertexAttribArray(attributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(attributeLocation, size, this.gl.FLOAT, false, 0, 0);
  }
  setView(view) {
    this.viewMatrix = view;
    this.setMatrix("viewMatrix", view);
  }
  setModel(model) {
    this.modelMatrix = model;
    this.setMatrix("modelMatrix", model);
    this.setNormal();
  }
  setNormal() {
    var normal = this.normalMatrix;
    var model = this.modelMatrix;
    var view = this.viewMatrix;
    mat4.identity(this.normalMatrix);
    mat4.multiply(normal, view, model);
    mat4.invert(normal, normal);
    mat4.transpose(normal, normal);
    this.normalMatrix = normal;
    this.setMatrix("normalMatrix", normal);
  }
  setMatrix(name, matrix) {
    var matrixUniform = this.gl.getUniformLocation(this.program, name);
    this.gl.uniformMatrix4fv(matrixUniform, false, matrix);
  }
  createBuffer(array) {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(array), this.gl.STATIC_DRAW);
    return buffer;
  }
  createIndexBuffer(index) {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), this.gl.STATIC_DRAW);
    return buffer;
  }
}
function makeShader(gl, src, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
  }
  return shader;
}
function handleResponse(response) {
  if (!response.ok)
    throw new Error("Error fetching resource");
  return response.text();
}
;
export var DrawMethod;
(function(DrawMethod2) {
  DrawMethod2[DrawMethod2["Smooth"] = WebGLRenderingContext.TRIANGLE_STRIP] = "Smooth";
  DrawMethod2[DrawMethod2["Lines"] = WebGLRenderingContext.LINE_STRIP] = "Lines";
  DrawMethod2[DrawMethod2["Fan"] = WebGLRenderingContext.TRIANGLE_FAN] = "Fan";
})(DrawMethod || (DrawMethod = {}));
