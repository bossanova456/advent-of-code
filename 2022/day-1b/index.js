https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2022/day/1/input',
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

    let maxElfCalorieArray = new Array(3).fill(0);

    function checkAndUpdateCalorieArray(newCalorieSum) {
        let hasInsertedValue = false;
        maxElfCalorieArray.map((calorieValue, index) => {
            if (newCalorieSum > calorieValue && !hasInsertedValue) {
                maxElfCalorieArray.splice(index, 0, newCalorieSum);
                hasInsertedValue = true;
            }
        });

        maxElfCalorieArray = maxElfCalorieArray.slice(0, 3);
    }

    res.on('end', () => {
        const inputData = data.join().toString('utf8').split('\n');

        const elfArray = [];

        let elfCalorieIndex = 0;
        inputData.map((calorieValue, i) => {
            if (calorieValue === '') {
                elfArray[elfArray.length] = inputData.slice(elfCalorieIndex, i);
                elfCalorieIndex = i+1;
            }
        });

        elfArray.map((calorieStringArray, index) => {
            const calorieSum = calorieStringArray
                .map(value => parseInt(value))
                .reduce((previousCalorieValue, currentCalorieValue) => {
                    const sum = previousCalorieValue + currentCalorieValue;
                    return sum;
                });
            
            checkAndUpdateCalorieArray(calorieSum);
        });

        const maxCalorieSum = maxElfCalorieArray.reduce((prev, cur) => prev + cur);
        console.log("Max sum: " + maxCalorieSum);

    })
})

req.end()