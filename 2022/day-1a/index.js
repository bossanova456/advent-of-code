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

        let maxCalorieSum = 0;
        elfArray.map((calorieStringArray, index) => {
            const calorieSum = calorieStringArray
                .map(value => parseInt(value))
                .reduce((previousCalorieValue, currentCalorieValue) => {
                    const sum = previousCalorieValue + currentCalorieValue;
                    return sum;
                });
            
            if (calorieSum > maxCalorieSum) maxCalorieSum = calorieSum;
        });

        console.log("Max sum: " + maxCalorieSum);

    })
})

req.end()