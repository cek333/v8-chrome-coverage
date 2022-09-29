# V8 Chrome Coverage

Experimental project to test extracting code coverage statistics from the v8 engine in Chrome.

## How It Works

Tests are run using the wdio framework. Using the wdio lifecycle hooks as well as the `@wdio/devtools-service`, we `startPreciseCoverage` at the beginning of a test suite, and `takePreciseCoverage` when a test suite is completed. The coverage data is written to the `.v8-coverage` directory.

On test completion, a script (`scripts/mergeAndResolveUrls.js`) is run to convert the `http` urls in the coverage files into file paths. A single json file with the resolved paths are written to `coverage/tmp/coverage.json`.

Next the `c8` tool is used to generate an `lcov` report. The coverage results can be viewed at `coverage/lcov-report/index.html`.

## Notable Dependencies

* chrome 104. If you're using a different version of chrome you'll have to install the chromedriver module matching your chrome browser.

## To Run

* `npm run ci`: This will run the test and generate the report. (Previous test reports and coverage data will be deleted!!!)
* `google-chrome coverage/lcov-report/index.html`: View the report.

## DEBUG

### OPTION 1: SETUP COVERAGE IN `beforeSuite` HOOK

This scenario works.

To run locally:
* Install the chromedriver matching your google-chrome browser version: `npm install --save-dev chromedriver@<version>`
* `npm run ci:beforesuite`

To run in docker:
* `docker build --tag v8-wdio .`
* `docker run -it v8-wdio ci:beforesuite`

### OPTION 2: SETUP COVERAGE IN `before` HOOK

This scenario doesn't work.

To run locally:
* Install the chromedriver matching your google-chrome browser version: `npm install --save-dev chromedriver@<version>`
* `npm run ci:before`

To run in docker:
* `docker build --tag v8-wdio .`
* `docker run -it v8-wdio ci:before`
