const https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const options = {
    hostname: 'adventofcode.com',
    path: '/2022/day/3/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (inputData) => {
    inputData = inputData.filter(line => line.length > 0);
    const dupItemPriorities = [];
    
    inputData.map((rucksack, i) => {
        const itemSet = new Set(rucksack.slice(0, rucksack.length/2).split(""));

        [...new Set(rucksack.slice(-rucksack.length/2).split(""))].map(item => {
            if (itemSet.has(item)) {
                const priorityValue = 
                    item.charCodeAt(0) < 'a'.charCodeAt(0) ? 
                    // Char is upper case
                    item.charCodeAt(0) - 'A'.charCodeAt(0) + 27 : 
                    // Char is lower case
                    item.charCodeAt(0) - 'a'.charCodeAt(0) + 1
                dupItemPriorities.push(priorityValue);
            };
        });
    });

    console.log("Sum of priorities is: " + dupItemPriorities.reduce((prev, cur) => prev + cur));

}

inputData = cache.getSync('inputData');

if (!inputData) {
    console.log("Did not find input data in cache");

    const req = https.get(options, res => {
        console.log(`statusCode: ${res.statusCode}`);

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
