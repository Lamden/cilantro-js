import * as assert from "assert"
import * as helpers from "../build/ts/helpers";
import * as testhelpers from "./testhelpers";


describe("Helper Functions", function() {
    describe("TypeCasting", function () {
        describe("BASIC", function () {
            describe("hex2buf", function () {
                it('should return a Uint8Array', function () {
                    assert(helpers.hex2buf("11223344").constructor === Uint8Array);
                });
                it('should return an array of length string.length/2', function () {
                    var str = "11223344";
                    var buf = helpers.hex2buf(str);
                    assert((str.length/2) == buf.length);
                });
            });

            describe("buf2hex", function () {
                it('should return a string', function () {
                    var buffer = new Uint8Array([0,5,10]);
                    assert(typeof(helpers.buf2hex(buffer)) == 'string');
                });
                it('should return a string of length buffer.length*2', function () {
                    var buffer = new Uint8Array([0,5,10]);
                    var str = helpers.buf2hex(buffer);
                    assert((buffer.length*2) == str.length);
                });
            });

            describe("str2buf", function () {
                it('should returna Uint8array', function () {
                    assert(helpers.str2buf("Hello World").constructor === Uint8Array);
                });
            });
            describe("str2hex", function () {
                it('should return a string with length of original string*2', function () {
                    var str = "123";
                    assert(helpers.str2hex(str).length === str.length*2);
                });
            });
            describe("hex2str", function () {
                it('should return a string with length of original string/2', function () {
                    var str = "112233";
                    assert(helpers.hex2str(str).length === str.length/2);
                });
            });
        });
        describe("COMPLEX", function () {
            describe("hex2buf -> buf2hex", function () {
                it('starting hex and resultant hex should be equal', function () {
                    var hexstr = '11223344';
                    var buf = helpers.hex2buf(hexstr);
                    var reshex = helpers.buf2hex(buf);
                    assert.strictEqual(hexstr, reshex);
                });
            });
            describe("buf2hex -> hex2buf", function () {
                it('starting buffer and resultant buffer should be equal', function () {
                    var buffer = new Uint8Array([0,5,10]);
                    var hex = helpers.buf2hex(buffer);
                    var resbuffer = helpers.hex2buf(hex);
                    assert(testhelpers.bufequal(buffer, resbuffer));
                });
            });
            describe("str2hex -> hex2str", function () {
                it('should start and end with the same string', function () {
                    var str = "Hello World"
                    var hex = helpers.str2hex(str);
                    var resstr = helpers.hex2str(hex);
                    assert(str === resstr);
                });
            });
        });
    });

    describe("Concatenation", function () {
        describe("concatUint8Arrays", function () {
            it("should return a Uint8Array", function () {
                var ua1 = new Uint8Array([0,5,10]);
                var ua2 = new Uint8Array([11,12,13,14]);
                assert(helpers.concatUint8Arrays(ua1, ua2).constructor === Uint8Array);
            });
            it("should return a Uint8Array of length array1.length+array2.length", function () {
                var ua1 = new Uint8Array([0,5,10]);
                var ua2 = new Uint8Array([11,12,13,14]);
                var concat = helpers.concatUint8Arrays(ua1, ua2);
                assert((concat.length == (ua1.length + ua2.length)) && (concat.length > 0));
            });
            it("should have array1 in first array1.length bytes and array2 in next array2.length bytes", function () {
                var ua1 = new Uint8Array([0,5,10]);
                var ua2 = new Uint8Array([11,12,13,14]);
                var concat = helpers.concatUint8Arrays(ua1, ua2);
                assert((testhelpers.bufequal(concat.slice(0,ua1.length), ua1)) && (testhelpers.bufequal(concat.slice(ua1.length,ua1.length+ua2.length),ua2)));
            });
        });
    });

    describe("Randomization", function () {
        describe("randomString", function () {
            it("should generate an alphanumeric string of length 16", function () {
                var re = /^[a-zA-Z0-9]{16}$/
                var str = helpers.randomString(16);
                assert(str.match(re))
            });
        });
    });
});
