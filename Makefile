.PHONY: schemas build src transpile permissions test

build: dirs schemas src

dirs:
	@mkdir -p build/ts
	@mkdir -p build/js
	@mkdir -p build/bundle

schemas:
	@capnpc -o ts src/capnp-schemas/schemas/* && mv src/capnp-schemas/schemas/*.ts build/ts/

src:
	@cp src/ts/* build/ts/

transpile:
	@tsc --module system --moduleResolution node --lib es2018,dom --out build/js/cilantro-js.js build/ts/*

permissions:
	@chmod +x build/js/*
	@chmod +x build/ts/*

test: build
	@mocha -r ts-node/register test/*.test.ts

clean:
	rm -rf build

bundle:
	@gulp setup
	@gulp transpile
	@gulp bundlejs
