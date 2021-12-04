https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/3/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        const inputData = d.toString('utf8').split('\n');

        const binaryLength = inputData[0].length;
        let oxygen = inputData, co2 = inputData;
        const reducer = (previous, current) => (previous ? parseInt(previous) : 0) + (current ? parseInt(current) : 0);

        for (let i=0; i<binaryLength && oxygen.length>1; i++) {
            const onesCount = oxygen.map(value => value[i]).reduce(reducer);
            oxygen = oxygen.filter(binaryValue => binaryValue[i] === (onesCount >= oxygen.length / 2.0 ? "1" : "0"));
        }

        for (let i=0; i<binaryLength && co2.length>1; i++) {
            const onesCount = co2.map(value => value[i]).reduce(reducer);
            co2 = co2.filter(binaryValue => binaryValue[i] === (onesCount >= co2.length / 2.0 ? "0" : "1"));
        }

        const lifeSupport = parseInt(oxygen[0], 2) * parseInt(co2[0], 2);

        console.log("Oxygen: " + oxygen + " | CO2: " + co2 + " | Life Support: " + lifeSupport);
    })
})

req.end()