https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const options = {
    hostname: 'adventofcode.com',
    path: '/2023/day/1/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (inputData) => {
    const result = inputData
        .filter(row => row.length > 0)
        .map(row => [...row].filter(char => char.charCodeAt(0) >= 48 && char.charCodeAt(0) < 58))
        .map(digits => parseInt(digits[0] + digits[digits.length - 1]))
        .reduce((a, b) => a + b);

    console.log(result);
}

inputData = cache.getSync('inputData');

if (!inputData) {
    console.log("Did not find input data in cache");

    const req = https.get(options, res => {
        console.log(`Status Code: ${res.statusCode}`)

        const data = [];

        res.on('data', d => {
            data.push(d);
        });

        res.on('end', () => {
            inputData = data.join().toString('utf8').split('\n');
            cache.put('inputData', inputData, () => {});
        });
    });

    req.end();
}
else {
    console.log("Found input data in cache");
}

processData(inputData);