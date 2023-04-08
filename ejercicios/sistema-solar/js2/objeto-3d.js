const Type = {
    translate: "translate",
    scale: "scale",
    rotate: "rotate"
}

class Object3D {

    object = null;
    operations = [];
    modelMatrix = mat4.create();
    children = [];

    constructor(object = null, operations = [], children = []) {
        this.object = object;
        this.operations = operations,
        this.children = children;
        this.applyOperations();
    }

    applyOperations() {
        this.operations.reverse().forEach(op => {
            switch (op.type) {
                case Type.translate:
                    mat4.translate(this.modelMatrix, this.modelMatrix, op.params[0]);
                    break;
                case Type.rotate:
                    mat4.rotate(this.modelMatrix, this.modelMatrix, op.params[0], op.params[1]);
                    break;
                case Type.scale:
                    mat4.scale(this.modelMatrix, this.modelMatrix, op.params[0]);
                    break;
            }
        });
    }

    draw(parent=mat4.create()){
        let m = mat4.clone(parent);
        mat4.multiply(m, m, this.modelMatrix);
        if (this.object != null) {
            setTransform(this.object, m)
        }
        this.children.forEach(child => {child.draw(m)});
    }

}

class Operation {
    constructor(params = [], type = null) {
        this.params = params,
        this.type = type
    }
}

