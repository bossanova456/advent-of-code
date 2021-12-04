const fs = require('fs');
const readline = require('readline');
const lineReader = require('line-reader');

let depths = [];
let incCount = 0;
let prevSum, curSum;

const reducer = (previousValue, currentValue) => previousValue + currentValue;

lineReader.eachLine('./input.txt', function(line) {
    // console.log("Readingline: " + line);
    depths.push(parseInt(line))
    if (depths.length >= 3) {
        // console.log("Depths array: " + depths);
        if (!prevSum) prevSum = depths.reduce(reducer);
        else {

            depths = depths.slice(1, 4);
            curSum = depths.reduce(reducer);
            if (curSum - prevSum > 0) {
                incCount++;
            }

            console.log("Previous depth: " + prevSum + " | New depth: " + curSum + " | Inc Count: " + incCount);
            prevSum = curSum;
        }
    }
})

console.log("Count: " + incCount);