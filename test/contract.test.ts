import * as contract from '../build/ts/contract';
import * as assert from 'assert';
import * as testhelpers from './testhelpers';
import * as helpers from '../build/ts/helpers';
import * as chai from 'chai';

describe('Contract', function () {
    var sk = "846903f1258267d5cc44d2f55daeb8233303c903d750bb5781d7022f53f27923";
    var vk = "b49002fabf90e64074661aa8c2e599c2e726fc66fb4eddb91191885a701fc9da";
    var dest = "79eb8b4117e1d457f93883b9a61f5da31aecc3927127e787940eff42c97a4021";
    var contract_name = 'currency';
    var func_name = 'transfer';
    var stamps = 3000;
    var kwargs = {
        'amount': {
            'value': 2000,
            'type': 'fixedPoint'
        },
        'to': {
            'value': dest,
            'type': 'text'
        },
        'time': {
            'value': new Date(),
            'type': 'time'
        }
    };
    var ct = null;
    var tx = null;
    var tc = null;
    var tcbytes = null;
    var dtc = null;
    var dct = null;
    var dtcx = null;

    describe("negative", function() {
        it('should throw an error if it is provided a kwarg not in the valid types', function(done) {
            var testct = new contract.ContractTransaction();
            // kwargs are bad since uint16 is unsupported in JS implementation
            var badkwargs = {
                'test': {
                    'value': 'test',
                    'type': 'uint16'
                }
            }
            chai.expect(() => testct.create(contract_name, func_name, stamps, badkwargs)).to.throw;
            done();
        });
        it('should throw an error if the provided kwarg is not subscriptable to the underlying type', function(done) {
            var testct = new contract.ContractTransaction();
            // kwargs are bad since 'test' is not subscriptable to fixedPoint casting
            var badkwargs = {
                'test': {
                    'value': 'test',
                    'type': 'fixedPoint'
                }
            }
            chai.expect(() => testct.create(contract_name, func_name, stamps, badkwargs)).to.throw;
            done();
        });
        it('should throw an error if the sender_sk is malformed', function(done) {
            var testct = new contract.ContractTransaction();
            var badsk = "asdf";
            testct.create(contract_name, func_name, stamps, kwargs)
            chai.expect(() => testct.sign(badsk)).to.throw;
            done();
        });
        it('should throw an error if the stamps are the wrong type', function(done) {
            var testct = new contract.ContractTransaction();
            var badstamps = 'stamps';
            chai.expect(() => testct.create(contract_name, func_name, badstamps, kwargs)).to.throw;
            done();
        });
    });
    describe("create", function() {
        it('should create a transaction blob for a currency transfer contract', function() {
            this.timeout(60000);
            ct = new contract.ContractTransaction();
            ct.create(contract_name, func_name, stamps, kwargs);
            ct.sign(sk);
        });
        it('should create a transaction container to contain currency transfer blob', function() {
            this.timeout(60000);
            tc = new contract.ContractTransactionContainer();
            tc.create(ct.tx);
        });
        it('should serialize a transaction container to a capnproto blob', function() {
            this.timeout(60000);
            tcbytes = tc.toBytesPacked();
        });
    });
    describe("deserialize", function() {
        it("should deserialize a transactionContainer to a transaction blob", function() {
            this.timeout(60000);
            dtc = new contract.ContractTransactionContainer();
            dtc.createFromBytesPacked(tcbytes);
        });
        it("should deserialze a transaction blob to its original parts", function() {
            this.timeout(60000);
            dct = new contract.ContractTransaction();
            dct.createFromBytesPacked(dtc.payload);
            assert(dct.sender_vk == vk);
            assert(dct.stamps_supplied == stamps);
            assert(dct.contract_name == contract_name);
            assert(dct.func_name == func_name);
            assert(JSON.stringify(dct.kwargs) == JSON.stringify(kwargs));
        });
    });
});
