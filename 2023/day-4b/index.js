https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

const options = {
    hostname: 'adventofcode.com',
    path: '/2023/day/4/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (data) => {
    const counts = Array(data.length).fill(1);
    data
        // Remove row header
        .map(row => row.split(': ')[1])
        // Separate card numbers from winning numbers
        .map((row, r) => row.split(' | '))
        // Separate numbers
        .map(lists => lists.map(list => list.split(' ').filter(n => n !== '')))
        // Retain common elements to get winning numbers
        .map(lists => lists[1].filter(n => lists[0].includes(n)))
        // Duplicate cards based on winning number count
        .forEach((numbers, n) => {
            [...Array(numbers.length).keys()].map(card => n + card + 1 < data.length ? counts[n + card + 1] += counts[n] : null);
        });

    // Calculate scores
    const results = counts.reduce((total, score) => total + score);

    console.log("Results: " + results);
}

let inputData = cache.getSync('inputData');

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
}