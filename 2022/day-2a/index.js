const https = require('https')
const NodeCache = require('persistent-cache');
require('dotenv').config()

const cache = new NodeCache();

let inputData = [];

const options = {
    hostname: 'adventofcode.com',
    path: '/2022/day/2/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const processData = (inputData) => {
    const oppMatchupJson = {
        // X, A: Rock
        // Y, B: Paper
        // Z, C: Scissors

        // Key: shape
        // Value: win condition for shape
        'A': 'Z',
        'B': 'X',
        'C': 'Y'
    };

    const myMatchupJson = {
        'X': 'C',
        'Y': 'A',
        'Z': 'B'
    };

    const scoreJson = {
        'X': 1,
        'Y': 2,
        'Z': 3
    };

    const getMatchupScore = (playerChoice, opponentChoice) => {
        if (myMatchupJson[playerChoice] === opponentChoice) return 6 // Win
        else if (oppMatchupJson[opponentChoice] === playerChoice) return 0; // Lose
        else return 3;  // Tie
    }

    const scoreArray = inputData
        .filter(matchupString => matchupString.length > 0)  // Remove empty strings
        .map(round => {
            [ opponentChoice, myChoice ] = round.split(' ');

            const choiceScore = scoreJson[myChoice];
            const matchupScore = getMatchupScore(myChoice, opponentChoice);

            return choiceScore + matchupScore;
    });

    const totalScore = scoreArray.reduce((prev, cur) => prev + cur);

    console.log("Total score: " + totalScore);

}

inputData = cache.getSync('inputData');

if (!inputData) {
    console.log("Did not find input data in cache");

    const req = https.get(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

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
