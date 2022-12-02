const https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const options = {
    hostname: 'adventofcode.com',
    path: '/2022/day/1/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (inputData) => {
    const elfArray = [];

    let elfCalorieIndex = 0;
    inputData.map((calorieValue, i) => {
        if (calorieValue === '') {
            elfArray[elfArray.length] = inputData.slice(elfCalorieIndex, i);
            elfCalorieIndex = i+1;
        }
    });

    let maxElfCalorieArray = new Array(3).fill(0);

    elfArray.map((calorieStringArray, index) => {
        const calorieSum = calorieStringArray
            .map(value => parseInt(value))
            .reduce((previousCalorieValue, currentCalorieValue) => {
                const sum = previousCalorieValue + currentCalorieValue;
                return sum;
            });

        ((newCalorieSum) => {
            let hasInsertedValue = false;
            maxElfCalorieArray.map((calorieValue, index) => {
                if (newCalorieSum > calorieValue && !hasInsertedValue) {
                    maxElfCalorieArray.splice(index, 0, newCalorieSum);
                    hasInsertedValue = true;
                }
            });
    
            maxElfCalorieArray = maxElfCalorieArray.slice(0, 3);
        })(calorieSum);
    });

    const maxCalorieSum = maxElfCalorieArray.reduce((prev, cur) => prev + cur);
    console.log("Max sum: " + maxCalorieSum);
}

inputData = cache.getSync('inputData');

if (!inputData) {
    console.log("Did not find input data in cache");

    const req = https.get(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        const data = [];

        res.on('data', d => {
            data.push(d);
        });

        res.on('end', () => {
            inputData = data.join().toString('utf8').split('\n');
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