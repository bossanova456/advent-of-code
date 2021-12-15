https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/10/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

function getCorruptedCharacter(line) {
    const openCharacters = ["(", "[", "{", "<"];
    const closeCharacters = [")", "]", "}", ">"];
    const queue = [];
    let corruptedCharacter;

    line.split('').map(character => {
        if (openCharacters.includes(character)) queue.push(character);
        else if (closeCharacters.includes(character) && queue.length > 0 && queue[queue.length-1] === openCharacters[closeCharacters.indexOf(character)]) queue.pop();
        else {
            if (corruptedCharacter === undefined) corruptedCharacter = character;
        }
    })

    return corruptedCharacter;
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    const data = [];

    res.on('data', d => {
        data.push(d);
    })

    res.on('end', () => {
        const inputData = data.join().toString('utf8').split('\n');

        const corruptedCharacters = [];
        for (let i=0; i<inputData.length; i++) {
            const corruptedCharacter = getCorruptedCharacter(inputData[i]);
            if (corruptedCharacter) corruptedCharacters.push(corruptedCharacter);
        }

        const scoreJson = {
            ')': 3,
            ']': 57,
            '}': 1197,
            '>': 25137
        };

        const score = corruptedCharacters.map(character => scoreJson[character]).reduce((previous, current) => previous + current);
        console.log("Score: " + score);
    })
})

req.end()