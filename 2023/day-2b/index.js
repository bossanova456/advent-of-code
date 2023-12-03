https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const testData = [
    "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
    "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
    "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
    "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
    "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"
];

const options = {
    hostname: 'adventofcode.com',
    path: '/2023/day/2/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (data) => {
    // const result = data
    //     .map(row => row.split(': ')[1])
    //     .map(row  => {
    //         const colors = {
    //             "red": 0,
    //             "green": 0,
    //             "blue": 0
    //         };

    //         row.split('; ').map(set => {
    //             set.split(', ').map(color => {
    //                 const colorName = color.split(' ')[1];
    //                 const value = parseInt(color.split(' ')[0]);

    //                 colors[colorName] = Math.max(colors[colorName], value);

    //                 return {c: colorName, value}
    //             })
    //             .map(color => console.log("Color: " + JSON.stringify(color)))
    //             .reduce((a, b) => {
    //                 const colorName = b[colorName];
    //                 const colorValue = b[value];
    //                 console.log("Color name: " + colorName + " | Value: " + colorValue);

    //                 // return a[b[colorName]] ? a[b[colorName]] + a[b[value]] : a[b[value]];
    //                 return a[colorName] ? a[colorName] + colorValue : colorValue;
    //             });
    //         });

    //         return Object.keys(colors).map(key => colors[key]).reduce((a, b) => a * b);
    //     })
    //     .reduce((a, b) => a + b);

    // console.log("Result: " + result);

    const result = data
        .map(row => row.split(': ')[1])
        .map(row  => {
            const colors = {
                "red": 0,
                "green": 0,
                "blue": 0
            };

            row.split('; ').map(set => {
                set.split(', ').map(color => {
                    const c = color.split(' ')[1];
                    const value = parseInt(color.split(' ')[0]);

                    colors[c] = Math.max(colors[c], value);
                })
            });

            return Object.keys(colors).map(key => colors[key]).reduce((a, b) => a * b);
        })
        .reduce((a, b) => a + b);

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