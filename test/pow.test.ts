import * as pow from "../build/ts/pow";
import * as assert from "assert";

describe("POW", function () {
    describe("find", function () {
        it("should return a 32 character hex string", function () {
            this.timeout(60000);
            var object = new Uint8Array([0,5,10]);
            var p = pow.find(object);
            assert(p.pow.length === 32)
        });
        it("should return an object with properties pow and cts", function () {
            this.timeout(60000);
            var object = new Uint8Array([0,5,10]);
            var p = pow.find(object);
            assert(p.hasOwnProperty('pow') && p.hasOwnProperty('cts'));
        });
    });
    describe("check", function () {
        it("should return a boolean", function () {
            this.timeout(60000);
            var object = new Uint8Array([0,5,10]);
            var p = pow.find(object);
            assert(typeof(pow.check(object, p.pow)) == 'boolean');
        });
        it("should throw an error if proof is not of length 32", function () {
            this.timeout(60000);
            var object = '1234';
            try {
                var p = pow.find(object);
                pow.check(object, p.pow);
                throw "generate pow succeeded with string not of length 32";
            } catch {}
        });
        it("should return true when checking a valid (generated) pow", function () {
            this.timeout(60000);
            var object = new Uint8Array([0,5,10]);
            var p = pow.find(object);
            assert(pow.check(object, p.pow));
        });
    });
});
