https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/9/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    const data = [];

    function getNeighbors(array, i, j) {
        const neighbors = [];
        // Check above and below
        if (i > 0) neighbors.push({'x': i-1, 'y': j, 'value': array[i-1][j]});
        if (i < array.length - 1) neighbors.push({'x': i+1, 'y': j, 'value': array[i+1][j]});

        // Check left and right
        if (j > 0) neighbors.push({'x': i, 'y': j-1, 'value': array[i][j-1]});
        if (j < array[i].length - 1) neighbors.push({'x': i, 'y': j+1, 'value': array[i][j+1]});

        return neighbors;
    }

    function isLowPoint(neighborsArray, heightMapValue) {
        return neighborsArray.filter(neighbor => neighbor.value <= heightMapValue).length === 0;
    }

    res.on('data', d => {
        data.push(d);
    })

    res.on('end', () => {
        const inputData = data.toString('utf8').split('\n');

        const testData = [
            "2199943210",
            "3987894921",
            "9856789892",
            "8767896789",
            "9899965678"
        ];

        // const heightMap = inputData.map(value => value.split('').map(height => parseInt(height)));
        const heightMap = testData.map(value => value.split('').map(height => parseInt(height)));
        const lowPointsArray = [];
        const lowPointsCoords = [];
        const basinCoords = [];

        for (let i=0; i<heightMap.length; i++) {
            for (let j=0; j<heightMap[i].length; j++) {
                const neighbors = getNeighbors(heightMap, i, j);

                // Compare to neighbors
                if (isLowPoint(neighbors, heightMap[i][j])) {
                    // lowPointsArray.push(heightMap[i][j]);
                    lowPointsArray.push({'x': i, 'y': j, 'value': heightMap[i][j]});

                    // Push neighbors of the low points to check for basin confirmation
                    basinCoords.push({'x': i, 'y': j, 'value': heightMap[i][j]});
                }
            }
        }

        // Now check for the low points neighbors and add to basins if necessary
        // Initialize with low points
        console.log("Low points: " + lowPointsArray);
        const basinArrays = Array(lowPointsArray.length).fill().map(() => Array(1));
        for (i=0; i<basinArrays.length; i++) basinArrays[i][0] = lowPointsArray[i];


        console.log("Basin arrays length: " + basinArrays[0].length);
        // basinArrays.map(basinArray => console.log(JSON.stringify(basinArray)));
        // lowPointsArray.map((lowPoint, index) => basinPoints[index][0] = lowPoint);

        for (let i=0; i<basinArrays.length; i++) {
        // basinArrays.map(coordsArray => {
            const coordsArray = basinArrays[i];
            // coordsArray.map((coords, index) => {
            for (let j=0; j<basinArrays[i].length; j++) {
                const coords = coordsArray[i];
                // Get neighbors
                const basinNeighbors = getNeighbors(heightMap, coords.x, coords.y);

                // Check if point is lower than any neighbors
                // If so, then add to basin array
                // Skip if neighbor is already in basin array
                basinNeighbors.map(basinNeighbor => {
                    // Get neighbors of basin neighbor
                    const neighbors = getNeighbors(heightMap, basinNeighbor.x, basinNeighbor.y).filter(neighbor => !basinArrays[i].includes(neighbor));
                    if (neighbors.filter(neighbor => neighbor.value <= basinNeighbor.value).length === 0) {
                        console.log("Adding to basin array: " + basinNeighbor.value);
                        basinArrays[i].push(basinNeighbor)
                    }
                })
            }
        }

        // Formula for risk is (x_1 + 1) + (x_2 + 1) + ... + (x_n + 1)
        // This simplifies to (x_1 + x_2 + ... + x_n) + n
        // const sum = lowPointsArray.reduce((previous, current) => previous + current) + lowPointsArray.length;
        // console.log("Sum: " + sum);
    })
})

req.end()