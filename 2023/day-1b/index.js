https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const testData = [
    "two1nine",
    "eightwothree",
    "abcone2threexyz",
    "xtwone3four",
    "4nineeightseven2",
    "zoneight234",
    "7pqrstsixteen"
];

const options = {
    hostname: 'adventofcode.com',
    path: '/2023/day/1/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (data) => {
    const values = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine"
    ];

    console.log(data);
    const result = data
        .filter(row => row.length > 0)
        .map(row => {       // loop through input data
            let digits = "";
            rowTemp = row;
            console.log("Row: " + row);
            while (rowTemp.length > 0) {    // loop throw full string
                let matchFound = false;
                for (let i=0; i<10; i++) {  // loop through values array
                    const sliceLength = Math.min(values[i].length, rowTemp.length);
                    if (rowTemp.slice(0, sliceLength) === values[i]) {
                        console.log("Found match: " + values[i] + " | " + rowTemp.slice(0, sliceLength) + " | " + rowTemp);
                        digits += i;
                        rowTemp = rowTemp.substring(values[i].length, rowTemp.length);
                        matchFound = true;
                        break;
                    } else if (rowTemp[0] === "" + i) {
                        console.log("Found match: " + i + " | " + rowTemp[0] + " | " + rowTemp);
                        digits += i;
                        rowTemp = rowTemp.substring(1, rowTemp.length);
                        matchFound = true;
                        break;
                    }
                }

                if (!matchFound) {
                    // console.log("No match found: " + rowTemp.slice(0, rowTemp.length));
                    rowTemp = rowTemp.substring(1, rowTemp.length);
                }
            }

            console.log("Digits: " + digits);

            return digits;
        })
        // .map(row => [...row].filter(char => char.charCodeAt(0) >= 48 && char.charCodeAt(0) < 58))
        .map(digits => parseInt(digits[0] + digits[digits.length - 1]))
        .reduce((a, b) => a + b);

    console.log(result);
}

inputData = cache.getSync('inputData');

if (!inputData) {
    console.log("Did not find input data in cache");

    const req = https.get(options, res => {
        console.log(`Status Code: ${res.statusCode}`)

        const data = [];

        res.on('data', d => {
            data.push(d);
        });

        res.on('end', () => {
            inputData = data.join().toString('utf8').split('\n').filter(row => row.length > 0);
            cache.put('inputData', inputData, () => {});

            processData(inputData);
            // processData(testData);
        });
    });

    req.end();
}
else {
    console.log("Found input data in cache");

    processData(inputData);
    // processData(testData);
}