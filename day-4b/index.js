https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/4/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        let inputData = d.toString('utf8').split('\n');

        const chosenNumbersInput = inputData[0].split(',');
        console.log("Chosen numbers: " + chosenNumbersInput);
        inputData = inputData.slice(1).filter(line => line != '');

        const bingoArrays = Array(inputData.length/5).fill(Array(5)).map((line, index) => inputData.slice(index*5, index*5 + 5));
        const rowMatchedNumbers = Array(bingoArrays.length).fill().map(() => Array(5).fill().map(() => Array()));
        const colMatchedNumbers = Array(bingoArrays.length).fill().map(() => Array(5).fill().map(() => Array()));
        let availableBingos = [...bingoArrays.keys()];
        console.log("Available bingos: " + availableBingos);

        let lastBingoArray, matchedChosenNumbersArray = Array().fill();
        
        chosenNumbersInput.map((chosenNumber, chosenNumberIndex) => {
            const availableBingosClone = [...availableBingos.values()];
            console.log("=============================");
            console.log("Chosen number: " + chosenNumber);
            availableBingosClone.map(i => {
                const bingo = bingoArrays[i];
                console.log("Bingo:");
                bingo.map(value => console.log(value));
                for (let j=0; j<5; j++) {
                    const row = bingo[j].split(' ').filter(value => value != '');
                    const col = bingo.map(value => value.split(' ').filter(value => value != '')[j]);

                    if (row.includes(chosenNumber)) {
                        console.log("---------------------------");
                        console.log("Found row match: " + chosenNumber);
                        console.log("Row: " + row);
                        rowMatchedNumbers[i][j]++;
                        if (rowMatchedNumbers[i][j] >= 5) {
                            console.log("Removing bingo array: " + i);
                            availableBingos = availableBingos.filter(value => value != i);
                            lastBingoArray = i;
                            if (!matchedChosenNumbersArray.includes(chosenNumber)) matchedChosenNumbersArray.push(chosenNumber);
                            break;
                        }
                        console.log("---------------------------");
                    }

                    if (col.includes(chosenNumber)) {
                        console.log("---------------------------");
                        console.log("Found col match: " + chosenNumber);
                        console.log("Col: " + col);
                        colMatchedNumbers[i][j]++;
                        if (colMatchedNumbers[i][j] >= 5) {
                            console.log("Removing bingo array: " + i);
                            availableBingos = availableBingos.filter(value => value != i);
                            lastBingoArray = i;
                            if (!matchedChosenNumbersArray.includes(chosenNumber)) matchedChosenNumbersArray.push(chosenNumber);
                            break;
                        }
                    }

                    // console.log("Row " + j + ": " + row);
                    // console.log("Col " + j + ": " + col);
                }
            })
        })

        console.log("Last bingo array: " + lastBingoArray + " | Bingo length: " + bingoArrays[lastBingoArray].length);
        bingoArrays[lastBingoArray].map(value => console.log(value));

        console.log("Row marked counts:");
        rowMatchedNumbers[lastBingoArray].map(value => console.log(value));

        console.log("Column marked counts:");
        colMatchedNumbers[lastBingoArray].map(value => console.log(value));

        // Get sum of board
        console.log("Matched chosen numbers: " + matchedChosenNumbersArray);
        const sum = bingoArrays[lastBingoArray].map(row => row.split(' ').filter(value => value != '').map(value => parseInt(value)).filter(value => !matchedChosenNumbersArray.includes(value)).reduce((previous, current) => previous + current)).reduce((previous, current) => previous + current);
        console.log("Sum: " + sum + " | Final number: " + matchedChosenNumbersArray[matchedChosenNumbersArray.length-1] + " | Score: " + sum * matchedChosenNumbersArray[matchedChosenNumbersArray.length-1]);
    })
})

req.end()