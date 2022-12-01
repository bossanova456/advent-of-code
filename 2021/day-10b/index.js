https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/10/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

function isCorrupted(line) {
    const openCharacters = ["(", "[", "{", "<"];
    const closeCharacters = [")", "]", "}", ">"];
    const queue = [];
    let corruptedCharacter;

    line.split('').map(character => {
        if (corruptedCharacter === undefined) {
            if (openCharacters.includes(character)) queue.push(character);
            else if (closeCharacters.includes(character) && queue.length > 0 && queue[queue.length-1] === openCharacters[closeCharacters.indexOf(character)]) queue.pop();
            else corruptedCharacter = character;
        }
    })

    return (corruptedCharacter === undefined ? queue : undefined);
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    const data = [];

    res.on('data', d => {
        data.push(d);
    })

    res.on('end', () => {
        const inputData = data.join().toString('utf8').split('\n');

        const closingCharacters = {
            '(': ')',
            '[': ']',
            '{': '}',
            '<': '>'
        };
        
        const scoreJson = {
            ')': 1,
            ']': 2,
            '}': 3,
            '>': 4
        };

        const incompleteQueues = [];
        for (let i=0; i<inputData.length; i++) {
            corruptedString = isCorrupted(inputData[i]);
            if (corruptedString) {
                incompleteQueues.push(corruptedString);
            }
        }

        const completionStrings = [];
        for (let i=0; i<incompleteQueues.length; i++) {
            const incompleteQueueCharacters = incompleteQueues[i];

            let completionString = ""
            for (let j=incompleteQueueCharacters.length-1; j>=0; j--) {
                const incompleteCharacter = incompleteQueueCharacters[j];
                completionString += closingCharacters[incompleteCharacter];
            }

            completionStrings[i] = completionString;
        }

        let sum = Array(completionStrings.length).fill(0);
        const scoreArrays = completionStrings.map(completionString => completionString.split('').map(completionCharacter => scoreJson[completionCharacter]));
        scoreArrays.forEach((scoreArray, index) => {
            for (let i=0; i<scoreArray.length; i++) {
                sum[index] = (sum[index] * 5) + scoreArray[i];
            }
        })

        const medianSum = sum.sort(function compareNumbers(a, b) { return a - b })[Math.floor(sum.length/2)];
        console.log("Median sum: " + medianSum);
    })
})

req.end()