https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/6/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        const inputData = d.toString('utf8').split(',');

        console.log("Input data: " + inputData);
        let fishArray = inputData.map(fish => parseInt(fish));

        // We could consolidate all the initial inputs and set up the counts accordingly,
        // but for simplicity we just handle each one individually until we start adding fish
        const fishCounts = Array(fishArray.length).fill(1);
        const days = 256;

        console.log("Initial state: " + fishArray);
        console.log("Fish counts: " + fishCounts);
        console.log("Days: " + days);

        for (let i=0; i<days; i++) {
            const fishLength = fishArray.length;

            for (let j=0; j<fishLength; j++) {
                if (fishArray[j] > 0) {
                    fishArray[j]--;
                }
                else {
                    fishArray[j] = 6;
                    if (fishArray.length > fishLength && fishArray[fishLength] === 8) {
                        fishCounts[fishLength] += fishCounts[j];
                    }
                    else {
                        fishArray.push(8);
                        fishCounts.push(fishCounts[j]);
                    }
                }
            }
        }

        console.log("Fish array: " + fishArray);
        console.log("Fish counts: " + fishCounts);
        console.log("Number of fish: " + fishCounts.reduce((previous, current) => previous + current));
    })
})

req.end()