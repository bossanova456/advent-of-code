# advent-of-code
To start a new year, copy/paste a previous year folder and update the year in `template/index.js`

To start a new day, enter the directory for the year and run `./new-day.sh <day number>`

Each problem has its own directory. A .env file will be needed for each, containing `session=<sessionId>`. Session ID can be retrieved from adventofcode.com cookies once logged in (do not commit this)

Each index.js is set up to call the endpoint for the current year/day, and cache the input, which is saved in the `cache` directory

NOTE: sometimes the data doesn't get saved from the response properly (characters may get added/removed), so if strange results are returned, verify the input as a sanity check