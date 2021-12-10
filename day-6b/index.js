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
        // let fishArray = inputData.map(fish => parseInt(fish));
        let fishArray = [3, 4, 3, 1, 2];

        // newFishCount tracks the number of new fish with the same day count
        // newFishDays tracks the number of days for each set of newFish with the same day count
        let newFishCount = Array();
        let newFishDays = Array();
        const days = 18;

        console.log("Initial state: " + fishArray);

        for (let i=0; i<days; i++) {
            const newFishCountLength = newFishCount.length;
            const newFishCountCopy = [...newFishCount];
            const newFishDaysCopy = [...newFishDays];

            for (let j=0; j<newFishCountLength; j++) {
                // First check the new fish arrays
                if (newFishDaysCopy[j] > 0) {
                    newFishDaysCopy[j]--;
                }
                else {
                    newFishDaysCopy[j] = 6;
                    newFishCountCopy.push(1);
                    newFishDaysCopy.push(8);
                }
            }

            newFishCount = [...newFishCountCopy];
            newFishDays = [...newFishDaysCopy];

            let fishCopy = [...fishArray];
            for (let j=0; j<fishCopy.length; j++) {

                // Next, check the initial array, and append to new fish arrays if necessary
                // Doing this second prevents new fish from having day decremented before required
                if (fishCopy[j] > 0) {
                    fishCopy[j]--;
                }
                else {
                    console.log("Spawning new fish --- New fish count length: " + newFishCountLength + " | Days: " + newFishDays[newFishCountLength-1] + " | Count: " + newFishCount[newFishCountLength-1]);
                    fishCopy[j] = 6;
                    if (newFishCountLength >= 0 && newFishDays[newFishCountLength] === 8) {
                        newFishCount[newFishCountLength]++;
                    }
                    else {
                        newFishCount.push(1);
                        newFishDays.push(8);
                    }
                }
            }

            // fishArray = [...fishCopy, ...newFish];
            fishArray = [...fishCopy];
            console.log("After day " + i + ": " + fishArray + " | " + newFishDays + " | " + newFishCount);
        }

        // console.log("Number of fish: " + fishArray.length);
        const numberOfFish = fishArray.length + newFishCount.reduce((previous, current) => previous + current);
        console.log("Number of fish: " + numberOfFish);
    })
})

req.end()