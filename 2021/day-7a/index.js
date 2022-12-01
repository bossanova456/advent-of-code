const { Console } = require('console')

https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/7/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        const inputData = d.toString('utf8').split(',');
        const positions = inputData.map(value => parseInt(value));

        console.log("Positions: " + positions);

        // Get median
        const median = positions.sort((a, b) => a - b)[Math.floor(positions.length/2)];
        console.log("Median: " + median);

        // Calculate fuel as distance from each point to median
        const fuel = positions.map(value => Math.abs(value - median)).reduce((previous, current) => previous + current);
        console.log("Fuel used: " + fuel);
    })
})

req.end()