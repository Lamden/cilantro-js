.PHONY: schemas build src transpile permissions test

build: dirs schemas src transpile permissions

dirs:
	@mkdir -p build/ts
	@mkdir -p build/js

schemas:
	@capnpc -o ts src/capnp-schemas/schemas/* && mv src/capnp-schemas/schemas/*.ts build/ts/

src:
	@cp src/js/* build/ts/

transpile:
	@tsc --lib es6 --outDir build/js/ build/ts/*

permissions:
	@chmod +x build/js/*
	@chmod +x build/ts/*

test: build
	@mocha -r ts-node/register test/*.test.ts
