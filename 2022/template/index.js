const https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const options = {
    hostname: 'adventofcode.com',
    path: '/2022/day/${day}/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (inputData) => {
    // Code goes here

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
        });
    });

    req.end();
}
else {
    console.log("Found input data in cache");
}

processData(inputData);