https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/8/input',
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
        const inputData = data.join().toString('utf8').split('\n').filter(value => value != '');
        // console.log("Input data: " + inputData);

        const patterns = inputData.map(value => value.split(' | ')[0]).filter(value => value != '');
        const output = inputData.map(value => value.split(' | ')[1]);
        
        console.log("Pattern: " + patterns);
        console.log("Output: " + output);
        
        const digitCounts = output.map(values => values.split(' ').map(value => value.length === 2 || value.length === 4 || value.length === 3 || value.length === 7 ? 1: 0).reduce((previous, current) => previous + current)).reduce((previous, current) => previous + current);

        console.log("Counts: " + digitCounts);
    })
})

req.end()
