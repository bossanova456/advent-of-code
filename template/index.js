https = require('https')

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/${day}/input',
    headers: {
        Cookie: ''
    }
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        const inputData = d.toString('utf8').split('\n')
        process.stdout.write(inputData[0])
    })
})

req.end()