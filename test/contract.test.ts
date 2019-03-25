import * as contract from '../build/ts/contract';
import * as assert from 'assert';
import * as testhelpers from './testhelpers';
import * as helpers from '../build/ts/helpers';

describe('Contract', function () {
    var sk = "846903f1258267d5cc44d2f55daeb8233303c903d750bb5781d7022f53f27923";
    var vk = "b49002fabf90e64074661aa8c2e599c2e726fc66fb4eddb91191885a701fc9da";
    var dest = "79eb8b4117e1d457f93883b9a61f5da31aecc3927127e787940eff42c97a4021";
    var nonce = "b49002fabf90e64074661aa8c2e599c2e726fc66fb4eddb91191885a701fc9daBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";
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
        }
    };
    var ct = null;
    var tx = null;
    var tc = null;
    var tcbytes = null;
    var dtc = null;
    var dct = null;
    var dtcx = null;
    describe("create", function() {
        it('should create a transaction blob for a currency transfer contract', function() {
            this.timeout(60000);
            ct = new contract.ContractTransaction();
            tx = ct.create(contract_name, func_name, sk, stamps, nonce, kwargs);
        });
        it('should create a transaction container to contain currency transfer blob', function() {
            this.timeout(60000);
            tc = new contract.ContractTransactionContainer();
            tc.create(tx);
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
            assert(dct.nonce == nonce);
            assert(dct.contract_name == contract_name);
            assert(dct.func_name == func_name);
            assert(JSON.stringify(dct.kwargs) == JSON.stringify(kwargs));
        });
    });
});
