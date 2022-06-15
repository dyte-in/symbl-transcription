/* eslint-disable space-infix-ops */
const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');

const {
    version,
    description,
    main,
    module: pkgModule,
    exports: pkgExports,
    name,
    bugs,
    types,
    dependencies,
    scripts,
    repository,
    publishConfig,
} = pkg;

const {
    ENVIRONMENT = '/refs/head/staging',
    GHR = 'false',
} = process.env;

const tag = ENVIRONMENT.includes('staging') ? 'staging' : 'latest';

function replaceVersion(filename) {
    let file = fs.readFileSync(filename, 'utf8');
    file = file.replace('VERSION_PLACEHOLDER', version);
    fs.writeFileSync(filename, file);
}

['dist/index.umd.js', 'dist/index.es.js', 'dist/index.cjs.js'].map(replaceVersion);

const internalDependencyPrefix = '@dyte-in/';
const privateDependencies = Object.keys(dependencies)
    .filter((dependency) => dependency.startsWith(internalDependencyPrefix));

privateDependencies.forEach((dependency) => {
    delete dependencies[dependency];
});

function* walkSync(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
        if (file.isDirectory()) {
            yield* walkSync(path.join(dir, file.name));
        } else {
            yield path.join(dir, file.name);
        }
    }
}

const typesDir = 'types';
const importRegex = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s];?$/gm;

function updateDeclaration(fileName) {
    const file = fs.readFileSync(fileName, 'utf8');
    const internalImports = file.match(importRegex)?.filter((imported) => imported
        .includes(internalDependencyPrefix));

    if (!internalImports) return;

    const groupedImports = internalImports.map((imp) => {
        const matchRegex = new RegExp(importRegex);
        return matchRegex.exec(imp)[1].replace('{', '').replace('}', '').replaceAll(/[ \n]/ig, '');
    });

    let updatedFile = file;

    const imports = groupedImports.map((is) => is.split(','));
    imports.forEach((groupedImport, i) => {
        let importLines = '';
        groupedImport.forEach((importName) => {
            importLines += `type ${importName} = any; `;
        });
        updatedFile = updatedFile.replaceAll(internalImports[i], importLines);
    });

    fs.writeFileSync(fileName, updatedFile);
}

// eslint-disable-next-line no-restricted-syntax
for (const file of walkSync(typesDir)) {
    updateDeclaration(file);
}

fs.writeFileSync('./package.json', JSON.stringify({
    name: GHR === 'true' ? name : '@dytesdk/symbl-transcription',
    version,
    description,
    main,
    module: pkgModule,
    exports: pkgExports,
    types,
    bugs,
    private: false,
    dependencies,
    publishConfig: (GHR === 'true' || ENVIRONMENT.includes('staging'))
        ? { tag } : publishConfig,
    scripts: {
        start: scripts.start,
        postpublish: scripts.postpublish,
    },
    repository: process.env.GHR === 'true' ? repository : undefined,
}, null, 4));
