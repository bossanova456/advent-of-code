https = require('https')
require('dotenv').config()

const options = {
    hostname: 'adventofcode.com',
    path: '/2021/day/8/input',
    headers: {
        Cookie: `session=${process.env.session}`
    }
}

const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    
    const data = [];

    res.on('data', d => {
        data.push(d);
    })

    res.on('end', () => {
        const inputData = data.join().toString('utf8').split('\n').filter(value => value != '');
        // console.log("Input data: " + inputData);

        const testData = [
            "be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe",
            "edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc",
            "fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg",
            "fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb",
            "aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea",
            "fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb",
            "dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe",
            "bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef",
            "egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb",
            "gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce"
        ];

        const signalPatterns = [
            "cagedb",
            "ab",
            "gcdfa",
            "fbcad",
            "eafb",
            "cdfbe",
            "cdfgeb",
            "dab",
            "acedgfb",
            "cefabd"
        ];

        const patterns = inputData.map(value => value.split(' | ')[0]).filter(value => value != '');
        const outputArray = inputData.map(value => value.split(' | ')[1]);
        
        // const patterns = testData.map(value => value.split(' | ')[0]).filter(value => value != '');
        // const outputArray = testData.map(value => value.split(' | ')[1]);

        console.log("Pattern: " + patterns);
        console.log("Output: " + outputArray);
        
        // const digitCounts = output.map(values => values.split(' ').map(value => value.length === 2 || value.length === 4 || value.length === 3 || value.length === 7 ? 1: 0).reduce((previous, current) => previous + current)).reduce((previous, current) => previous + current);

        // console.log("Counts: " + digitCounts);

        const testString = "dab";
        console.log("Sorting string: " + testString.split('').sort((a, b) => a.localeCompare(b)).join(''))

        function sortCharacters(a, b) {
            return a.localeCompare(b)
        }

        const digitCounts = Array(10).fill(0);
        const decodedValues = Array(inputData.length).fill("");

        outputArray.map((values, outputIndex) => values.split(' ').map(output => signalPatterns.map((pattern, index) => {
            const sortedPattern = pattern.split('').sort(sortCharacters).join('');
            const sortedOutputValue = output.split('').sort(sortCharacters).join('');
            if (sortedPattern === sortedOutputValue) {
                decodedValues[outputIndex] += "" + index;
            }
        })))

        // console.log("Total counts: " + totalCounts);
        console.log("Decoded values: " + decodedValues[0]);
        const sum = decodedValues.filter(value => value != '').map(value => parseInt(value)).reduce((previous, current) => previous + current);
        console.log("Sum: " + sum);
    })
})

req.end()