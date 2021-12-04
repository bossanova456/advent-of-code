https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/2/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        const inputData = d.toString('utf8').split('\n');

        const positionCommands = inputData.filter(command => command.split(' ')[0] === 'forward').map(command => parseInt(command.split(' ')[1]));
        const downCommands = inputData.filter(command => command.split(' ')[0] === 'down').map(command => parseInt(command.split(' ')[1]));
        const upCommands = inputData.filter(command => command.split(' ')[0] === 'up').map(command => parseInt(command.split(' ')[1]));

        const reducer = (previous, current) => previous + current;

        const position = positionCommands.reduce(reducer);
        const depth = downCommands.reduce(reducer) - upCommands.reduce(reducer);

        console.log("Position: " + position + " | Depth: " + depth + " | Multiplication: " + position*depth);
    })
})

req.end()