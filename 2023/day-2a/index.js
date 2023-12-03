https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const options = {
    hostname: 'adventofcode.com',
    path: '/2023/day/2/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (data) => {
    let colors = {
        "red": 12,
        "green": 13,
        "blue": 14
    };
    
    const result = data
        .map(row => row.split(': ')[1])
        .map((row, index) => {
            const passes = 
                row.split('; ').map(set => {
                    return set.split(', ').map(color => {
                        const c = color.split(' ')[1];
                        const value = parseInt(color.split(' ')[0]);

                        return value <= colors[c];
                    })
                    .reduce((a, b) => a && b)
                })
                .reduce((a, b) => a && b);

            return passes ? index + 1 : 0;
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