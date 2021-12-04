https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/3/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        const inputData = d.toString('utf8').split('\n');

        const onesCountArray = Array(inputData[0].length).fill(0);
        inputData.forEach(binaryData => {
            for (let i=0; i<binaryData.length; i++) {
                if (binaryData[i] === "1") onesCountArray[i]++;
            }
        })

        const gammaArray = onesCountArray.map(value => (value > inputData.length/2.0 ? "1" : "0"))
        const epsilonArray = gammaArray.map(value => (value === "1" ? "0" : "1"))

        const power = parseInt(gammaArray.reduce((previous, current) => previous + current), 2) * parseInt(epsilonArray.reduce((previous, current) => previous + current), 2);

        console.log("Binary data count: " + inputData.length + " | Array: " + onesCountArray + " | Power: " + power);
    })
})

req.end()