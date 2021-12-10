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
        const days = 80;

        console.log("Initial state: " + fishArray);

        for (let i=0; i<days; i++) {
            const newFish = Array();

            let fishCopy = [...fishArray];
            for (let j=0; j<fishCopy.length; j++) {
                if (fishCopy[j] > 0) fishCopy[j]--;
                else {
                    fishCopy[j] = 6;
                    newFish.push(8);
                }
            }

            fishArray = [...fishCopy, ...newFish];
        }

        console.log("Number of fish: " + fishArray.length);
    })
})

req.end()