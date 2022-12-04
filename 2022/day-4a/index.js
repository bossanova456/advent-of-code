const https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const options = {
    hostname: 'adventofcode.com',
    path: '/2022/day/4/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const isOverlapping = (pairs, index) => {
    // Expecting an array of two arrays of values, with larger values at the end

    return pairs[0][1] - pairs[0][0] >= pairs[1][1] - pairs[1][0] ?
        // Pair 1 range is larger
        pairs[0][1] >= pairs[1][1] && pairs[0][0] <= pairs[1][0] :
        // Pair 2 range is larger
        pairs[1][1] >= pairs[0][1] && pairs[1][0] <= pairs[0][0];
}

const processData = (inputData) => {
    inputData = inputData.filter(line => line.length > 0);

    const overlappingPairsSum = 
        inputData
            .map(pairs => pairs.split(","))
            .map(pairArrayStrings => pairArrayStrings.map(pairArrayString => pairArrayString.split("-").map(partialPair => parseInt(partialPair))))
            .filter(isOverlapping)
            .length;

    console.log("Sum: " + overlappingPairsSum);
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
