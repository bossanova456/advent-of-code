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
    const matchupJson = {
        // A: Rock
        // B: Paper
        // C: Scissors

        // Key: shape
        // Value: win condition for shape
        'A': 'C',
        'B': 'A',
        'C': 'B'
    };

    const outcomeJson = {
        'X': 'lose',
        'Y': 'draw',
        'Z': 'win'
    };

    const scoreJson = {
        'A': 1,
        'B': 2,
        'C': 3
    };

    const getChoiceScore = (opponentChoice, outcome) => {
        // Return points from choice where opponent wins to choice
        if (outcome === 'lose') return scoreJson[matchupJson[opponentChoice]];
        // Return points from choice where opponent loses to choice
        if (outcome === 'win') return scoreJson[matchupJson[matchupJson[opponentChoice]]];
        if (outcome === 'draw') return scoreJson[opponentChoice];
    };

    const getMatchupScore = (outcome) => {
        if (outcome === 'lose') return 0;
        if (outcome === 'draw') return 3;
        if (outcome === 'win')  return 6;
    };

    const scoreArray = inputData
        .filter(matchupString => matchupString.length > 0)  // Remove empty strings
        .map(round => {
            [ opponentChoice, outcomeCode ] = round.split(' ');

            const outcome = outcomeJson[outcomeCode];

            const choiceScore = getChoiceScore(opponentChoice, outcome);
            const matchupScore = getMatchupScore(outcome);

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
