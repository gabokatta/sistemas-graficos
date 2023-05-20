import {mat4, vec3} from "../../snowpack/pkg/gl-matrix.js";
const vertexShaderPath = "dist/shaders/vertex.glsl";
const fragmentShaderPath = "dist/shaders/fragment.glsl";
export class WebGL {
  constructor(canvas) {
    this.useTexture = false;
    this.normalColoring = false;
    this.showLines = false;
    this.showSurface = true;
    this.canvas = canvas;
    this.modelMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    this.projMatrix = mat4.create();
    this.normalMatrix = mat4.create();
    this.method = DrawMethod.Smooth;
    this.color = [0.8, 0.8, 1];
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
    let texture = await this.loadTexture("../assets/uv.jpg");
    await this.setUpShaders(vertexShader, fragmentShader);
    this.setUpMatrices();
    this.cleanGL();
    this.setColor(this.color);
    this.setNormalColoring(this.normalColoring);
    this.setTexture(texture);
    return this;
  }
  async loadTexture(file) {
    let gl = this.gl;
    let image = await loadImage(file);
    let texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
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
  draw(geometry, method = this.method) {
    this.setMatrixUniforms();
    const vertexBuffer = this.createBuffer(geometry.position);
    const normalBuffer = this.createBuffer(geometry.normal);
    const binormalBuffer = this.createBuffer(geometry.binormal);
    const tangentBuffer = this.createBuffer(geometry.binormal);
    const uvBuffer = this.createBuffer(geometry.uv);
    const indexBuffer = this.createIndexBuffer(geometry.index);
    this.setAttribute(vertexBuffer, 3, "aVertexPosition");
    this.setAttribute(normalBuffer, 3, "aVertexNormal");
    this.setAttribute(binormalBuffer, 3, "aVertexBinormal");
    this.setAttribute(tangentBuffer, 3, "aVertexTangent");
    this.setAttribute(uvBuffer, 2, "aVertexUV");
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    if (this.showSurface)
      this.gl.drawElements(method, geometry.index.length, this.gl.UNSIGNED_SHORT, 0);
    if (this.showLines) {
      this.setDrawColor([0.4, 0.4, 0.4]);
      this.gl.drawElements(this.gl.LINE_STRIP, geometry.index.length, this.gl.UNSIGNED_SHORT, 0);
      this.setDrawColor(this.color);
    }
  }
  drawObjectNormals(n) {
    for (let i = 0; i < n.length; i += 24) {
      this.drawLine(n[i], n[i + 1]);
    }
  }
  drawLine(p1, p2, normals = [0, 0, 0, 0, 0, 0]) {
    this.draw({
      position: [...p1, ...p2],
      index: [0, 1],
      normal: normals
    }, DrawMethod.Lines);
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
  setDrawMethod(method) {
    this.method = method;
  }
  setAttribute(buffer, size, name) {
    const attributeLocation = this.gl.getAttribLocation(this.program, name);
    this.gl.enableVertexAttribArray(attributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(attributeLocation, size, this.gl.FLOAT, false, 0, 0);
  }
  setColor(color) {
    this.color = color;
    this.setDrawColor(this.color);
  }
  setDrawColor(color) {
    const modelColor = color.length == 0 ? [1, 0, 1] : color;
    const colorUniform = this.gl.getUniformLocation(this.program, "modelColor");
    this.gl.uniform3fv(colorUniform, vec3.fromValues(modelColor[0], modelColor[1], modelColor[2]));
  }
  setNormalColoring(bool) {
    this.normalColoring = bool;
    const normalColoringUniform = this.gl.getUniformLocation(this.program, "normalColoring");
    this.gl.uniform1i(normalColoringUniform, Number(bool));
    return this;
  }
  setTexture(texture) {
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, "texture"), 0);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
  }
  setUseTexture(bool) {
    this.useTexture = bool;
    const useTextureUniform = this.gl.getUniformLocation(this.program, "useTexture");
    this.gl.uniform1i(useTextureUniform, Number(bool));
    return this;
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
  DrawMethod2[DrawMethod2["LineStrip"] = WebGLRenderingContext.LINE_STRIP] = "LineStrip";
  DrawMethod2[DrawMethod2["Fan"] = WebGLRenderingContext.TRIANGLE_FAN] = "Fan";
  DrawMethod2[DrawMethod2["Lines"] = WebGLRenderingContext.LINES] = "Lines";
})(DrawMethod || (DrawMethod = {}));
export function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
  });
}
;
