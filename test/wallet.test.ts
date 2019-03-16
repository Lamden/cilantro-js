import * as wallet from '../build/ts/wallet';
import * as assert from 'assert';
import * as testhelpers from './testhelpers';
import * as helpers from '../build/ts/helpers';

describe("Wallet", function () {
    describe("generate_keys", function () {
        it('should return an object with the propertiess sk and vk', function () {
            var keys = wallet.generate_keys();
            assert(keys.hasOwnProperty('sk') && keys.hasOwnProperty('vk'));
        });
        it('should return object with properties of type Uint8Array', function () {
            var keys = wallet.generate_keys();
            assert((keys.sk.constructor === Uint8Array) && (keys.vk.constructor === Uint8Array));
        });
        it('should return Uint8Arrays of length 32', function () {
            var keys = wallet.generate_keys();
            assert((keys.sk.length === 32) && (keys.vk.length === 32));
        });
        it('should fail if seed is not Uint8Array', function () {
            try {
                wallet.generate_keys("hello");
                throw "generate_keys succeeded with string seed";
            } catch {}
        });
        it('should fail if Uin8Array seed length is not 32', function () {
            try {
                var seed = new Uint8Array([1,2,3]);
                wallet.generate_keys(seed);
                throw "generate keys succeeded with Uint8Array not of length 32";
            } catch {}
        });
        it('should succeed if seed is a Uint8Array of length 32', function () {
            var seed = new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]);
            wallet.generate_keys(seed);
        });
    });
    describe("keys_to_format", function () {
        it('should return an object with the properties sk and vk', function () {
            var keys = wallet.generate_keys();
            var fkeys = wallet.keys_to_format(keys);
            assert((fkeys.hasOwnProperty('sk')) && (fkeys.hasOwnProperty('vk')));
        });
        it('should return object with properties of type string', function () {
            var keys = wallet.generate_keys();
            var fkeys = wallet.keys_to_format(keys);
            assert((typeof(fkeys.sk) == 'string') && (typeof(fkeys.vk) == 'string'));
        });
        it('should return strings with length 64', function () {
            var keys = wallet.generate_keys();
            var fkeys = wallet.keys_to_format(keys);
            assert((fkeys.sk.length === 64) && (fkeys.vk.length === 64));
        });
    });
    describe("new_wallet", function () {
        it('should return an object with the properties sk and vk', function () {
            var keys = wallet.new_wallet();
            assert(keys.hasOwnProperty('sk') && keys.hasOwnProperty('vk'));
        });
        it('should return object with properties of type string', function () {
            var keys = wallet.new_wallet();
            assert((typeof(keys.sk) == 'string') && (typeof(keys.vk) == 'string'));
        });
        it('should return strings of length 64', function () {
            var keys = wallet.new_wallet();
            assert((keys.sk.length === 64) && (keys.vk.length === 64));
        });
    });
    describe('format_to_keys', function () {
        it('should return an object with the properties sk and vk', function () {
            var keys = wallet.new_wallet();
            var reskeys = wallet.format_to_keys(keys.sk);
            assert((reskeys.hasOwnProperty('sk')) && (reskeys.hasOwnProperty('vk')));
        });
        it('should return object with properties of type Uint8Array', function () {
            var keys = wallet.new_wallet();
            var reskeys = wallet.format_to_keys(keys.sk);
            assert((reskeys.sk.constructor === Uint8Array) && (reskeys.vk.constructor === Uint8Array));
        });
        it('should return Uint8Arrays of length 32', function () {
            var keys = wallet.new_wallet();
            var reskeys = wallet.format_to_keys(keys.sk);
            assert((reskeys.sk.length === 32) && (reskeys.vk.length === 32));
        });
        it('should return vk from sk matching original vk', function () {
            var keys = wallet.new_wallet();
            var reskeys = wallet.format_to_keys(keys.sk);
            var freskeys = wallet.keys_to_format(reskeys);
            assert(freskeys.vk === keys.vk);
        });
    });
    describe('get_vk', function () {
        it('should return an object of type string', function () {
            var keys = wallet.new_wallet();
            assert(typeof(wallet.get_vk(keys.sk)) == 'string');
        });
        it('should return a string of length 64', function () {
            var keys = wallet.new_wallet();
            assert(wallet.get_vk(keys.sk).length === 64);
        });
        it('resultant vk should be equal to original vk', function () {
            var keys = wallet.new_wallet();
            assert.strictEqual(keys.vk, wallet.get_vk(keys.sk));
        });
    });
    describe('sign', function () {
        it('should return an object of type string', function () {
            var keys = wallet.new_wallet();
            var msg = new Uint8Array([0,5,10]);
            assert(typeof(wallet.sign(keys.sk, msg)) == 'string');
        });
        it('should return a string of length 128', function () {
            var keys = wallet.new_wallet();
            var msg = new Uint8Array([0,5,10]);
            assert(wallet.sign(keys.sk, msg).length === 128);
        });
    });
    describe('verify', function () {
        it('should return a boolean', function () {
            var keys = wallet.new_wallet();
            var msg = new Uint8Array([0,5,10]);
            var sig = wallet.sign(keys.sk, msg);
            assert(typeof(wallet.verify(keys.vk, msg, sig)) == 'boolean');
        });
        it('should be able to verify a signed message', function () {
            var keys = wallet.new_wallet();
            var msg = new Uint8Array([0,5,10]);
            var sig = wallet.sign(keys.sk, msg);
            assert(wallet.verify(keys.vk, msg, sig));
        });
    });
});
