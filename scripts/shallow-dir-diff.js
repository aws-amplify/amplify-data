const path = require('path');
const fs = require('fs');

function main(a, b) {
    const differences = [];

    const aFileNames = fs.readdirSync(a);
    const bFileNames = fs.readdirSync(b);

    const allFileNames = new Set([...aFileNames, ...bFileNames])

    for (const fileName of allFileNames) {
        const aPath = path.join(a, fileName);
        const bPath = path.join(b, fileName);

        if (!aFileNames.includes(fileName)) {
            differences.push(`${bPath} exists, but ${aPath} does not exist.`);
        } else if (!bFileNames.includes(fileName)) {
            differences.push(`${aPath} exists, but ${bPath} does not exist.`);
        } else {
            const aData = fs.readFileSync(`${aPath}`).toString();
            const bData = fs.readFileSync(`${bPath}`).toString();
            if (aData !== bData) differences.push(`File contents differ for ${fileName}`)
        }
    }

    console.log(differences.join('\n'));
    console.log([
        `Files in ${a}: ${aFileNames.length}.`,
        `Files in ${b}: ${bFileNames.length}.`,
        `Differences: ${differences.length}`
    ].join(' '));

    if (differences.length > 0) {
        process.exit(1);
    }
}

main(process.argv[2], process.argv[3]);