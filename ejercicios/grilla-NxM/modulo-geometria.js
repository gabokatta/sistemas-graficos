

/*

    Tareas:
    ------

    1) Modificar a función "generarSuperficie" para que tenga en cuenta los parametros filas y columnas al llenar el indexBuffer
       Con esta modificación deberían poder generarse planos de N filas por M columnas

    2) Modificar la funcion "dibujarMalla" para que use la primitiva "triangle_strip"

    3) Crear nuevos tipos funciones constructoras de superficies

        3a) Crear la función constructora "Esfera" que reciba como parámetro el radio

        3b) Crear la función constructora "TuboSenoidal" que reciba como parámetro la amplitud de onda, longitud de onda, radio del tubo y altura.
        (Ver imagenes JPG adjuntas)
        
        
    Entrega:
    -------

    - Agregar una variable global que permita elegir facilmente que tipo de primitiva se desea visualizar [plano,esfera,tubosenoidal]
    
*/

// Shapes
var radioEsfera = 3;

var anchoPlano = 4;
var largoPlano = 4;

var amplitudOnda = 0.1;
var longitudOnda = 0.2;
var radioTubo = 1;
var alturaTubo = 3;

// Grid
var filas=30;
var columnas=30;

var mallaDeTriangulos;

function crearGeometria(superficie3D, filas, columnas){
    mallaDeTriangulos=generarSuperficie(superficie3D, filas, columnas);   
}

function dibujarGeometria(){
    dibujarMalla(mallaDeTriangulos);
}

function populateIndex() {
    indexBuffer = [];
    const indexCalc = (i,j) => (columnas+1)*i + j;
    for (i=0; i < filas; i++) {
        for (j=0; j <= columnas; j++) {
            indexBuffer.push(indexCalc(i,j), indexCalc(i+1,j));
        }
        indexBuffer.push(indexCalc(i+1, columnas), indexCalc(i+1,0));
    }
    return indexBuffer;
}

function generarSuperficie(superficie,filas,columnas){

    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {
            var u=j/columnas;
            var v=i/filas;

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs=superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);
        }
    }

    // Creación e Inicialización de los buffers
    indexBuffer = populateIndex();  

    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

function dibujarMalla(mallaDeTriangulos){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
       
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo!="wireframe"){
        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    if (modo!="smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
 
}

function Plano(ancho,largo){
    this.getPosicion=function(u,v){
        var x=(u-0.5)*ancho;
        var z=(v-0.5)*largo;
        return [x,0,z];
    }

    this.getNormal=function(u,v){
        return [0,1,0];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function Esfera(radio){
    this.getPosicion=function(u,v){

        const theta = u * 2 * Math.PI;
        const phi = (v - 0.5) * Math.PI;

        x = (radio*Math.cos(phi))*Math.cos(theta);
        y = radio*Math.sin(phi);
        z = (radio*Math.cos(phi))*Math.sin(theta);

        return vec3.fromValues(x,y,z);
    }

    this.getNormal=function(u,v){
        var pos = this.getPosicion(u,v);
        var normal = vec3.create();
        vec3.normalize(normal, pos);
        return normal;
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function TuboSenoidal(amplitud, longitud, radio, altura) {
    this.getPosicion = function (u, v) {
        const phi = u * Math.PI * 2;
        const theta = v * Math.PI * 2;
        const sin_theta = Math.sin(theta / longitud);
      
        const x = (radio + amplitud * sin_theta) * Math.cos(phi);
        const y = altura * v;
        const z = (radio + amplitud * sin_theta) * Math.sin(phi);
      
        return vec3.fromValues(x, y, z);
    };
  
    this.getNormal = function (u, v) {
        // TODO: En un futuro testear si funciona.
        // Conseguimos 3 puntos cercanos uno al otro.
        const p1 = this.getPosicion(u, v);
        const p2 = this.getPosicion(u + 0.01, v);
        const p3 = this.getPosicion(u, v + 0.01);

        // Conseguimos vectores tangentes al punto actual.
        const v1 = vec3.subtract(vec3.create(), p2, p1);
        const v2 = vec3.subtract(vec3.create(), p3, p1);

        // Calculamos el vector normal a ambos puntos como el producto cruzado y normalizamos el resultante.
        const normal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), v1, v2));

        return normal;
    };
  
    this.getCoordenadasTextura = function (u, v) {
        return [u,v];
    };
  }