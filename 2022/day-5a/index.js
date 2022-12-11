const https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const options = {
    hostname: 'adventofcode.com',
    path: '/2022/day/5/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (inputData) => {

    const testData = [
        "    [D]    ",
        "[N] [C]    ",
        "[Z] [M] [P]",
        " 1   2   3 ",
        "move 1 from 2 to 1",
        "move 3 from 1 to 3",
        "move 2 from 2 to 1",
        "move 1 from 1 to 2"
    ];

    const stackNumbersRegex = /([0-9])/g;
    const stackPosRegex = /( ?\[[A-Z]\] ?| ?    ?)/g;
    const boxRegex = /\[([A-Z])\]/g;
    const instructionsRegex = /move (\d{1}) from (\d{1}) to (\d{1})/;

    const stackNumbersTotal = 
        inputData
            .filter(line => line.match(stackNumbersRegex) !== null)
            [0]
            .match(stackNumbersRegex)
            .length;
    
    const stackQueues = Array.from(Array(stackNumbersTotal), () => new Array(0));

    const processInstruction = (instruction) => {
        console.log("Incoming instruction: " + instruction);
        const matches = instructionsRegex.exec(instruction).splice(1);
        for (let i = 0; i < matches[0]; i++) {
            stackQueues[matches[2]-1].push(stackQueues[matches[1]-1].pop());
            console.log("Destination stack: " + stackQueues[matches[2]-1]);
        }
    }

    const stackArray = 
        inputData
            .filter(line => line.match(stackPosRegex) !== null)
            .filter(line => line.match(stackNumbersRegex) === null)
            .reverse();

    console.log("Stacks: ");
    console.log(stackArray);

    console.log("Total number of stacks: " + stackNumbersTotal);

    stackArray.map(stack => {
        stack.match(stackPosRegex).map((box, index) => {
            if (box.match(boxRegex) !== null) stackQueues[index].push(box);
        });
    });

    console.log("Stack queues before: " + stackQueues.map(stack => stack + " | "));

    // const result = instructionsRegex.exec(testData[4]);
    // console.log("Instructions match: " + result.splice(1));

    inputData
        .filter(line => instructionsRegex.exec(line) !== null)
        .map(processInstruction);

    // processInstruction(testData[4]);
    // processInstruction(testData[5]);

    console.log("Stack queues after: " + stackQueues.map(stack => stack + "\n"));

    console.log("Tops of stacks:")
    console.log(stackQueues.map(stackQueue => console.log(stackQueue[stackQueue.length-1])));

    console.log("Last stack: " + stackQueues[stackQueues.length-1])
}

inputData = cache.getSync('inputData');


if (!inputData) {
    console.log("Did not find input data in cache");

    const req = https.get(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        const data = [];

        res.on('data', d => {
            data.push(d);
        });

        res.on('end', () => {
            inputData = data.join().toString('utf8').split('\n');
            cache.put('inputData', inputData, () => {});
            
            processData(inputData);
        });
    });

    req.end();
}
else {
    console.log("Found input data in cache");
    processData(inputData);
}
