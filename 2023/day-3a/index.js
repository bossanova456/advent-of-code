https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

// const testData = [
//     // "467..114..",
//     "...*......",
//     "..35..633.",
//     "......#...",
//     // "617*......",
//     // ".....+.58.",
//     // "..592.....",
//     // "......755.",
//     // "...$.*....",
//     // ".664.598.."
// ]
const testData = [
    "467..114..",   // 467
    "...*......",   // 0
    "..35..633.",   // 668
    "......#...",   // 0
    "617*......",   // 617
    ".....+.58.",   // 0
    "..592.....",   // 592
    "......755.",   // 755
    "...$.*....",   // 0
    ".664.598.."    // 1262
]

const options = {
    hostname: 'adventofcode.com',
    path: '/2023/day/3/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (data) => {
    const result = data
        // .filter(row => row.match(/[0-9]+/g))
        .map((row, r) => {
            console.log("Row: " + row);

            const matches = row.match(/[0-9]+/g);

            console.log("Matches: " + matches);

            if (matches !== null) {
                // Loop through matches and filter any not adjacent to a symbol...
                // (column)
                // h---> 
                // ...123   ^
                // ..11..   |
                // .....1   v (row)
                const matchesTemp = matches.filter((match, m) => {
                    // ... horizontally
                    // In the case of horizontal, no digits will be neighboring, only symbols
                    const hindex = row.indexOf(match) - 1;
                    const vindex = r - 1;
                    if (hindex >= 0 && row[hindex] !== '.') return true;
                    if ((hindex + match.length + 1) < row.length && row[hindex + match.length + 1] !== '.') return true;
                    // ... vertically
                    // Take slice of string in rows above & below using length of match string
                    console.log("Hindex: " + hindex + " | Vindex: " + vindex);
                    if (
                        // Check slice above
                        vindex >= 0 &&
                        [...data[vindex].slice(
                            Math.max(0, hindex),
                            Math.min(data[vindex].length, row.indexOf(match) + match.length + 1)
                        )].filter(c => c !== '.').length > 0
                    ) return true;
                    if (
                        // Check slice below
                        (vindex + 2) < data.length &&
                        [...data[vindex + 2].slice(
                            Math.max(0, hindex),
                            Math.min(data[vindex + 2].length, row.indexOf(match) + match.length + 1)
                        )].filter(c => c !== '.').length > 0
                    ) return true;

                    return false;
                })

                console.log("New matches: " + matchesTemp);
                console.log("==============");

                return matchesTemp;
            }
        })
        .filter(row => row !== undefined && row.length > 0)
        .map(row => row.map(r => parseInt(r)).reduce((a, b) => a + b))
        .reduce((a, b) => a + b)
    
    console.log("Result: " + result);
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
        });
    });

    req.end();
}
else {
    console.log("Found input data in cache");
    processData(inputData);
    // processData(testData);
}