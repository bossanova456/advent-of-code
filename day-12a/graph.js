import CaveVertex from "./vertex.js"

class CaveGraph {
    constructor() {
        this.verticesList = Map();
    }

    addVertex(v) {
        this.verticesList.set(v, []);
    }

    addEdge(v, w) {
        if (!this.verticesList.has(v)) this.addVertex(v);
        this.verticesList.get(v).push(w);

        if (!this.verticesList.has(w)) this.addVertex(w);
        this.verticesList.get(w).push(v);
    }
}

export default CaveGraph;