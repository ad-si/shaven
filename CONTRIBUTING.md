# Contributing

Shaven is written in TypeScript and requires Node.js 24 or later.
Run `make help` to list all available targets.


## Testing

Run `make test` to type check the code with `tsc`,
lint it with [oxlint](https://oxc.rs),
and execute all tests in the Node.js environment
and in the mockup DOM environment [jsdom](https://github.com/jsdom/jsdom).

The tests are executed directly from the TypeScript sources
via Node.js's built-in type stripping.
To run the tests in a browser, run `make build`
and open [./test/bundle/index.html](./test/bundle/index.html).


## Building

Run `make build` to compile the library to `./build`
(ES modules with type declarations, plus the standalone `build/shaven.js`
which exposes `shaven` as a global variable) and to build the website.
