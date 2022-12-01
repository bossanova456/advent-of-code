https = require('https')
require('dotenv').config()

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

    isEqual(v) {
        return v.name === this.name;
    }
}

class CaveEdge {
    constructor(v, w) {
        this.v = v;
        this.w = w;
    }

    printEdge() {
        console.log(this.v.name + " --> " + this.w.name);
    }
}

class CaveGraph {
    constructor() {
        this.verticesList = new Array();
        this.verticesAdjList = new Map();
    }

    addVertex(v) {
        this.verticesList.push(v);
        this.verticesAdjList.set(v.name, []);
    }

    addEdge(v, w) {
        if (!this.verticesAdjList.has(v.name)) this.addVertex(v);
        this.verticesAdjList.get(v.name).push(w);

        if (!this.verticesAdjList.has(w.name)) this.addVertex(w);
        this.verticesAdjList.get(w.name).push(v);
    }

    getVerticesList() {
        return [...this.verticesAdjList.keys()].filter(key => key != undefined)
    }
}

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/12/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    const data = [];

    res.on('data', d => {
        data.push(d);
    })

    res.on('end', () => {
        const inputData = data.join().toString('utf8').split('\n').filter(value => value != '');
        console.log("Input data:");
        console.log(inputData);

        const testData = [
            "start-A",
            "start-b",
            "A-c",
            "A-b",
            "b-d",
            "A-end",
            "b-end"
        ];

        const caveGraph = new CaveGraph();
        caveGraph.addVertex(new CaveVertex('start'));
        caveGraph.addVertex(new CaveVertex('end'));

        testData.map(edge => {
            const v = new CaveVertex(edge.split('-')[0]);
            const w = new CaveVertex(edge.split('-')[1]);
            caveGraph.addEdge(v, w);
        });

        // console.log(caveGraph)
        caveGraph.getVerticesList().forEach(element => {
            if (element != undefined) {
                [...caveGraph.verticesAdjList.get(element).keys()].forEach(vertex => {
                    console.log(element + " - " + caveGraph.verticesAdjList.get(element)[vertex].name);
                });
            }
        });

        const pathArray = new Array();
        const pathCount = 0;

        function checkVertexAndAddToPath(vertex, adjVertex, path) {
            // Check if vertex has been visited
            if ((!vertex.isBigCave && vertex.visitCount > 0) || (!adjVertex.isBigCave && adjVertex.visitCount > 0)) return;
            else if (vertex.name === 'end' || adjVertex.name === 'end') {
                pathArray.push([...path, adjVertex]);
                vertex.visitCount = 0;
                return;
            }
            else {
                adjVertex.visitCount++;
                adjVertex.verticesAdjList.forEach(v => {

                })
            }

            // if ((!vertex.isBigCave && vertex.visitCount > 0) || (!adjVertex.isBigCave && adjVertex.visitCount > 0)) return;
            // else {
            //     pathArray[pathCount].push([vertex, adjVertex]);
            //     if (vertex.name === 'end' || adjVertex.name === 'end') {
            //         pathCount++;
            //         return;
            //     }
            //     else adjVertex.getVerticesList().forEach(v => checkVertexAndAddToPath(adjVertex, v));
            // }
        }

        console.log("Number of ")
    })
})

req.end()