https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const testData = [
    "Time:      7  15   30",
    "Distance:  9  40  200"
]

const options = {
    hostname: 'adventofcode.com',
    path: '/2023/day/6/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (data) => {
    const times = data[0].split(':')[1].split(' ').filter(c => c.length > 0).map(t => parseInt(t));
    const distances = data[1].split(':')[1].split(' ').filter(c => c.length > 0).map(d => parseInt(d));

    console.log("t: " + times);
    console.log("d: " + distances);

    const results = times
        .map((time, t) => {
            console.log("=============");
            return [...Array(time).keys()].slice(1, time)
                .filter(speed => {
                    const distance = speed * (time - speed);
                    console.log("Speed: " + speed + " | Distance: " + distance);
                    return distance > distances[t];
                })
        })
        .map(buttonTimes => buttonTimes.length)
        .reduce((a, b) => a * b);

    console.log("Results: " + results);
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
            inputData = data.join().toString('utf8').split('\n').filter(row => row.length > 0);
            cache.put('inputData', inputData, () => {});

            processData(inputData);
        });
    });

    req.end();
}
else {
    console.log("Found input data in cache");
    processData(inputData);
    // processData(testData);
}