const fs     = require('fs');
const path   = require('path');
const url    = require('url');
const mkdirp = require('mkdirp');

const v8CoverageFolder = path.join(__dirname, '.v8-coverage');

const makeFolder = () => {
  if (!fs.existsSync(v8CoverageFolder)) {
    mkdirp.sync(v8CoverageFolder);
  }
};

/*
 * Various helpers for functionality common across our wdio configs
 */
module.exports = {

  startCoverage() {
    // https://github.com/webdriverio-boneyard/wdio-devtools-service/issues/8
    return new Promise(function(resolve) {
      process.nextTick(async function() {
        await browser.cdp('Profiler', 'enable');

        /**
         * start test coverage profiler
         */
        await browser.cdp('Profiler', 'startPreciseCoverage', {
          callCount : true,
          detailed  : true,
        });

        makeFolder();

        console.log('Coverage enabled');

        resolve();
      });
    });
  },

  async dumpCoverage() {
    /**
     * capture test coverage
     */
    const c8coverage = await browser.cdp('Profiler', 'takePreciseCoverage');
    if (!c8coverage.result) {
      console.log('*** NO COVERAGE DATA ***');
    }
    
    const filename = path.join(v8CoverageFolder, `coverage-${Date.now().toString()}.json`);
    //   const str = JSON.stringify(c8coverage, null, 2) + '\n'
    const str = JSON.stringify(c8coverage);
    fs.writeFileSync(filename, str, 'utf8');

    console.log(`writing coverage to ${filename}`);
  },

  stopCoverage() {
    return browser.cdp('Profiler', 'stopPreciseCoverage');
  },

};
