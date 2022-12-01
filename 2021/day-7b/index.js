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

        // Get mean
        const mean = Math.floor(positions.reduce((previous, current) => previous + current) / positions.length);
        console.log("Mean: " + mean);

        // Calculate fuel as distance from each point to median
        const fuel = positions.map(value => ((value - mean) * (value - mean) + Math.abs(value - mean)) / 2).reduce((previous, current) => Math.floor(previous + current));
        console.log("Fuel used: " + fuel);
    })
})

req.end()