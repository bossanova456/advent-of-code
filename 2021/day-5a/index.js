const { start } = require('repl')

https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/5/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        const inputData = d.toString('utf8').split('\n').filter(value => value != '');

        const startCoords = inputData.map(value => value.split(' -> ')[0]);
        const endCoords = inputData.map(value => value.split(' -> ')[1]);

        // console.log("Start coords:");
        // startCoords.map(value => console.log(value));

        // console.log("End coords:");
        // endCoords.map(value => console.log(value));

        const xStartCoords = startCoords.map(value => value.split(',').map(value => parseInt(value))[0]);
        const yStartCoords = startCoords.map(value => value.split(',').map(value => parseInt(value))[1]);
        const xEndCoords = endCoords.map(value => value.split(',').map(value => parseInt(value))[0]);
        const yEndCoords = endCoords.map(value => value.split(',').map(value => parseInt(value))[1]);
        // console.log("Start Y coords:");
        // yStartCoords.map(value => console.log(value))

        const xMax = Math.max(xStartCoords.reduce((previous, current) => Math.max(previous, current)), xEndCoords.reduce((previous, current) => Math.max(previous, current)));
        const yMax = Math.max(yStartCoords.reduce((previous, current) => Math.max(previous, current)), yEndCoords.reduce((previous, current) => Math.max(previous, current)));
        // console.log("X max: " + xMax + " | Y max: " + yMax);

        //              Y Coords
        //          --------------------
        //          |
        // X Coords |       X, Y
        //          |
        //          |
        //          |

        const ventArray = Array(xMax).fill().map(() => Array(yMax).fill(0));
        // console.log("X length: " + ventArray.length + " | Y length: " + ventArray[0].length);

        // Step through coordinates
        for (let i=0; i<inputData.length; i++) {
            // Get step direction for X & Y
            let xStep, yStep;
            if (xEndCoords[i] === xStartCoords[i]) xStep = 0;
            else xStep = (xEndCoords[i] > xStartCoords[i] ? 1 : -1);
            if (yEndCoords[i] === yStartCoords[i]) yStep = 0;
            else yStep = (yEndCoords[i] > yStartCoords[i] ? 1 : -1);

            const distance = Math.max(Math.abs(xEndCoords[i] - xStartCoords[i]), Math.abs(yEndCoords[i] - yStartCoords[i]));
            // console.log("Start coords: (" + xStartCoords[i] + "," + yStartCoords[i] + ") | End coords: (" + xEndCoords[i] + "," + yEndCoords[i] + ")");
            // console.log("X step: " + xStep + " | Y step: " + yStep + " | Distance: " + distance);

            if (xStep === 0 || yStep === 0) {
                for (let j=0; j<=distance; j++) {
                    // console.log("X index: " + (j*xStep + xStartCoords[i]) + " | Y index: " + (j*yStep + yStartCoords[i]));
                    ventArray[j*xStep + xStartCoords[i]][j*yStep + yStartCoords[i]]++;
                }
            }
        }

        let ventCount = 0;
        ventArray.map(ventRow => ventRow.map(value => {if (value > 1) ventCount++}));
        console.log("Vent count: " + ventCount);
    })
})

req.end()