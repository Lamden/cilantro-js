# cilantro-js
## Introduction
Cilantro-JS is a library which implements the underlying Cilantro protocol in javascript to allow for the local and secure serialization of contract transactions to be submitted to the cilantro network.

## Install Dependencies
apt install node-typescript

apt install mocha

install node and npm:

npm v5.6.0

node v8.10.0

npm install

## Build
After cloning the repository you will need to run the below commands to build the underlying typescript into usable javascript

```
gulp setup
```

This will create the `build` directory in the root of `cilantro-js`. Inside this directory there are 3 sub-directories:

```
bundle/
js/
ts/
```

The `ts` directory contains all of the typescript files brought together into a single directory for transpiling, the `js` directory contains all the transpiled files from the `ts` directory, and the `bundle` directory contains a single `bundle.js` file to be used for web applications.

```
gulp transpile
```

This will transpile the contents of `build/ts` into like-for-like files in `build/js`.

```
gulp bundlejs
```

This will take the contents of `build/js` alongside all npm dependencies and generate a monolithic bundle under `build/bundle` for distribution as a generic javascript library.

## Test
Following a successful build, the test endpoints can be run against the generated Javascript library:

```
make test
```

This will run the suite of unit tests against the built code (note, `make build` is a prerequisite of the tests running) to ensure its integrity. If for some reason your local tests are not passing after a successful build, please feel free to open a ticket [here](https://github.com/Lamden/cilantro-js/issues/new).
