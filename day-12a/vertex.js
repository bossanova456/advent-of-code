class CaveVertex {
    constructor(name) {
        this.name = name;
        this.isBigCave = name.split('').filter(character => character === character.toUpperCase()).length > 0;
        this.visitCount = 0;
    }

    visitEdge() {
        this.visitCount++;
    }

    isCaveVisitable() {
        return this.isBigCave || this.visitCount < 1;
    }
}

export default CaveVertex;