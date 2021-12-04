const fs = require('fs');
const readline = require('readline');
const lineReader = require('line-reader');

let previousDepth;
let incCount = 0;

lineReader.eachLine('./input.txt', function(line) {
    // console.log("Readingline: " + line);
    if (!previousDepth) previousDepth = parseInt(line);
    else {
        newDepth = parseInt(line);
        if (newDepth - previousDepth > 0) {
            incCount++;
        }

        console.log("Previous depth: " + previousDepth + " | New depth: " + newDepth + " | Inc Count: " + incCount);
        previousDepth = newDepth;
    }
    
})

console.log("Count: " + incCount);