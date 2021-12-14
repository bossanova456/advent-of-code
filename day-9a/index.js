https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/9/input',
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
        const inputData = data.toString('utf8').split('\n');

        const heightMap = inputData.map(value => value.split('').map(height => parseInt(height)));
        const lowPointsArray = [];

        for (let i=0; i<heightMap.length; i++) {
            for (let j=0; j<heightMap[i].length; j++) {
                const neighbors = [];
                // Check above and below
                if (i > 0) neighbors.push(heightMap[i-1][j]);
                if (i < heightMap.length - 1) neighbors.push(heightMap[i+1][j]);

                // Check left and right
                if (j > 0) neighbors.push(heightMap[i][j-1]);
                if (j < heightMap[i].length - 1) neighbors.push(heightMap[i][j+1]);

                // Compare to neighbors
                if (neighbors.filter(neighbor => neighbor <= heightMap[i][j]).length === 0) {
                    lowPointsArray.push(heightMap[i][j]);
                }
            }
        }

        // Formula for risk is (x_1 + 1) + (x_2 + 1) + ... + (x_n + 1)
        // This simplifies to (x_1 + x_2 + ... + x_n) + n
        const sum = lowPointsArray.reduce((previous, current) => previous + current) + lowPointsArray.length;
        console.log("Sum: " + sum);
    })
})

req.end()