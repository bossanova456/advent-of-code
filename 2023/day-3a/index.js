https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const options = {
    hostname: 'adventofcode.com',
    path: '/2023/day/3/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (data) => {
    const result = data
        .map((row, r) => {
            console.log("Row: " + row);
            let rowTemp = row;

            const matches = rowTemp.match(/[0-9]+/g);

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
                    const hindex = rowTemp.indexOf(match) - 1;
                    const vindex = r - 1;
                    let matchFound = false;
                    console.log("Hindex: " + hindex + " | Vindex: " + vindex);
                    if ((hindex >= 0 && rowTemp[hindex] !== '.') ||
                        ((hindex + match.length + 1) < rowTemp.length && rowTemp[hindex + match.length + 1] !== '.') ||
                    // ... vertically
                    // Take slice of string in rows above & below using length of match string
                        (
                            // Check slice above
                            vindex >= 0 &&
                            [...data[vindex].slice(
                                Math.max(0, hindex),
                                Math.min(data[vindex].length, rowTemp.indexOf(match) + match.length + 1)
                            )].filter(c => c !== '.' && !"0123456789".includes(c)).length > 0
                        ) ||
                        (
                            // Check slice below
                            (vindex + 2) < data.length &&
                            [...data[vindex + 2].slice(
                                Math.max(0, hindex),
                                Math.min(data[vindex + 2].length, rowTemp.indexOf(match) + match.length + 1)
                            )].filter(c => c !== '.' && !"0123456789".includes(c)).length > 0
                        )
                    ) matchFound = true;

                    rowTemp = rowTemp.replace(match, ".".repeat(match.length));

                    return matchFound;
                });

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
}