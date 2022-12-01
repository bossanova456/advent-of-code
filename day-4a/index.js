const { match } = require('assert');

https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/4/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

function printBingo(bingo) {
    bingo.map(row => {
        console.log(row)
    })
}

let inputData;

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        inputData = d.toString('utf8').split('\n');

        const chosenNumbersInput = inputData[0].split(',');
        console.log("Chosen numbers: " + chosenNumbersInput);
        inputData = inputData.slice(1).filter(line => line != '');

        // inputData.slice(1).filter(value => value != "").map(line => bingoArrays.push(line.split(' ').filter(value => value != '')));
        const bingoArrays = Array(inputData.length/5).fill(Array(5)).map((line, index) => inputData.slice(index*5, index*5 + 5));
        
        let matchBingoIndex, matchRowIndex, matchColIndex, finalChosenNumbers;
        for (let i=5; i<chosenNumbersInput.length && !matchBingoIndex; i++) {
            const rowMatchCounts = Array(bingoArrays.length).fill().map(() => Array(5).fill(0));
            const colMatchCounts = Array(bingoArrays.length).fill().map(() => Array(5).fill(0));
            const rowMatchedNumbers = Array(bingoArrays.length).fill().map(() => Array(5).fill().map(() => Array()));
            const colMatchedNumbers = Array(bingoArrays.length).fill().map(() => Array(5).fill().map(() => Array()));
            
            const chosenNumbers = chosenNumbersInput.slice(0, i);

            // console.log("====================");
            // console.log("Using chosen numbers: " + chosenNumbersInput.slice(0, i));

            // chosenNumbersInput.slice(0, i).map(chosenNumber => {
            for (let c=0; c<i && !matchBingoIndex; c++) {
                const chosenNumber = chosenNumbers[c];
                console.log("-------------------");
                console.log("Chosen number: " + chosenNumber);
                // bingoArrays.map((bingo, index) => {
                for (let j=0; j<bingoArrays.length && !matchBingoIndex; j++) {
                    // bingoArrays[j].map((row, rowNum) => {
                    console.log("Looking at array " + j + ":");
                    printBingo(bingoArrays[j])
                    for (let k=0; k<bingoArrays[j].length && !matchBingoIndex; k++) {
                        const row = bingoArrays[j][k].split(' ').filter(value => value != '');
                        if (row.includes(chosenNumber)) {
                            console.log("Found " + chosenNumber + " in row: " + row);

                            // console.log("Row counts:");
                            // console.log(rowMatchCounts[j]);
                            rowMatchCounts[j][k]++;
                            rowMatchedNumbers[j][k].push(chosenNumber);

                            if (rowMatchCounts[j][k] >= 5) {
                                matchBingoIndex = j;
                                matchRowIndex = k;
                                // console.log("Found match: " + chosenNumbersInput.slice(0, i) + " | Row: " + row);
                                finalChosenNumbers = chosenNumbersInput.slice(0, i);
                                console.log("Matched numbers: " + rowMatchedNumbers[j][k]);
                                break;
                            }
                        }

                        const col = bingoArrays[j].map((value, index) => value.split(' ').filter(value => value != '')[k]);
                        if (col.includes(chosenNumber)) {
                            console.log("Found " + chosenNumber + " in col: " + col);

                            colMatchCounts[j][k]++;
                            colMatchedNumbers[j][k].push(chosenNumber);

                            if (colMatchCounts[j][k] >= 5) {
                                matchBingoIndex = j;
                                matchColIndex = k;
                                console.log("Found match: " + chosenNumbersInput.slice(0, i) + " | Col: " + col);
                                finalChosenNumbers = chosenNumbersInput.slice(0, i);
                                console.log("Matched numbers: " + colMatchedNumbers[j][k]);
                                break;
                            }
                        }
                    }
                }
            }
        }

        console.log("Match bingo index: " + matchBingoIndex + " | Match row index: " + matchRowIndex + " | Match col index: " + matchColIndex);
        console.log("Final numbers: " + finalChosenNumbers);
        console.log("Bingo:");
        if (matchBingoIndex) printBingo(bingoArrays[matchBingoIndex]);

        // Get sum of board
        const sum = bingoArrays[matchBingoIndex].map(row => row.split(' ').filter(value => value != '').filter(value => !finalChosenNumbers.includes(value)).map(value => parseInt(value)).reduce((previous, current) => previous + current)).reduce((previous, current) => previous + current);
        console.log("Board sum: " + sum + " | Final chosen number: " + finalChosenNumbers[finalChosenNumbers.length-1] + " | Solution: " + (sum * finalChosenNumbers[finalChosenNumbers.length-1]));
    })
});

req.end()