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
        const inputData = d.toString('utf8').split('\n')

        let aim = 0, position = 0, depth = 0;
        inputData.forEach(input => {
            switch (input.split(' ')[0]) {
                case 'forward':
                    position += parseInt(input.split(' ')[1])
                    depth += aim * parseInt(input.split(' ')[1])
                    break;
                case 'down':
                    aim += parseInt(input.split(' ')[1])
                    break;
                case 'up':
                    aim -= parseInt(input.split(' ')[1])
                    break;
            }
        });

        console.log("Position: " + position + " | Depth: " + depth + " | Multiplication: " + position*depth);
    })
})

req.end()