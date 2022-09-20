const url = require('url')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')

const isFile = (path) => fs.existsSync(path) && !fs.statSync(path).isDirectory();

async function main() {
  if (process.argv.length < 5) {
    console.log('Usage: node resolveUrls.js in-dir out.json resolvePath');
    process.exit(1);
  }
  
  const inDir = process.argv[2];
  const outFilename = process.argv[3];
  const resolvePath = process.argv[4];

  const acc = [];
  try {
    const files = fs.readdirSync(inDir);
    for (const file of files) {
      console.log(`Processing ${file} ...`);
      // Read and merge json files
      try {
        const v8Coverage = JSON.parse(fs.readFileSync(`${inDir}/${file}`));
        
        if (v8Coverage.result) {
          for (const tempReport of v8Coverage.result) {
            const report = JSON.parse(JSON.stringify(tempReport));
            try {
              const u = new url.URL(report.url);
              const filename = path.join(resolvePath, u.pathname);
              if (isFile(filename)) {
                report.url = `file://${filename}`;
                acc.push(report);
                console.log(`resolving file ${filename}`);
              }
            } catch (e) {
              // ignore errors
              // console.log(e);
            }
          }
        }
      } catch (err) {
        console.log(`Error: ${file} not found`);
        process.exit(2);
      }
    }
  } catch (err) {
    console.log(`Directory ${inDir} could not be read`);
    process.exit(3);
  }  

  const filteredCoverage = { "result": acc };
  fs.writeFileSync(
    outFilename,
    JSON.stringify(filteredCoverage)
  );
}

main();
