declare const Buffer;

import * as capnp from 'capnp-ts';
import * as md5 from 'md5';
import * as bigInt from 'big-integer';
import * as transactionSchemas from './transaction.capnp';
import * as helpers from './helpers';
import * as wallet from './wallet';
import * as pow from './pow';

var ContractTransaction = transactionSchemas.ContractTransaction;
var TransactionContainer = transactionSchemas.TransactionContainer;
var Metadata = transactionSchemas.MetaData;
var ContractPayload = transactionSchemas.ContractPayload;
var Kwargs = transactionSchemas.Kwargs;
var Value = transactionSchemas.Value;
var Map = transactionSchemas.Map;

export class CurrencyTransactionContainer {
    tx: capnp.Message;

    constructor() {
    }

    create(currencyTransaction) {
        const struct = new capnp.Message()
        const txContainer = struct.initRoot(TransactionContainer);

        const txbytes = new Uint8Array(currencyTransaction.toPackedArrayBuffer());
        const pl = txContainer.initPayload(txbytes.byteLength);
        pl.copyBuffer(txbytes);

        // Hack to recreate md5 registry for contract transaction in python w/ javascript
        var md5Hash = md5('ContractTransaction');
        var l = bigInt(md5Hash, 16).divmod(Math.pow(2,16)).remainder.valueOf();

        txContainer.setType(l);

        this.tx = struct;

        return struct;
        
    }

    toBytesPacked() {
        return this.tx.toPackedArrayBuffer();
    }

    toBytes() {
        return this.tx.toArrayBuffer();
    }

    deserializeData(i) {
        const msg = new capnp.Message(i);
        const tc = msg.getRoot(TransactionContainer);
        return tc;
    }
}

export class CurrencyContractTransaction {
    sender_sk: string;
    sender: string;
    stamps_supplied: number;
    nonce: string;
    to: string;
    contract_name: string;
    func_name: string;
    signature: string;
    pow: string;
    amount: number;
    tx: capnp.Message;

    constructor(contract_name='currency', func_name='transfer') {
        this.contract_name = contract_name;
        this.func_name = func_name;
    }

    // PSUEDO-CONSTRUCTOR
    create(sender_sk, stamps_supplied, nonce, to, amount) {
        // Fill the class objects for later use
        // These are initialized here instead of in the constructor so we can emulate having multiple
        // constructors (as with in python @class_method)
        this.sender_sk = sender_sk;
        this.stamps_supplied = stamps_supplied;
        this.nonce = nonce;
        this.to = to;
        this.amount = amount;

        // Initialize capnp objects
        const struct = new capnp.Message();
        const tx = struct.initRoot(ContractTransaction);
        const metadata = tx.initMetadata();
        const message = new capnp.Message();
        const payload = message.initRoot(ContractPayload);
        const valuebuffer = new capnp.Message(); // In order to set the value we need to
                                                 // construct it as a message than deepcopy
                                                 // it over
        const valuebuf = valuebuffer.initRoot(Value);
        const kwargs = payload.initKwargs();
        const entries = kwargs.initEntries(2); // Set to static length of 2 for currency contract

        // Cast required inputs to capnp types
        const stamps = capnp.Uint64.fromNumber(this.stamps_supplied);

        // Build the deterministic section of the payload
        payload.setContractName(this.contract_name);
        payload.setFunctionName(this.func_name);
        payload.setNonce(this.nonce);
        payload.setSender(wallet.get_vk(this.sender_sk));
        payload.setStampsSupplied(stamps);

        // Build the non-deterministic section of the payload (kwargs)
        entries.get(0).setKey('to');
        entries.get(1).setKey('amount');
        valuebuf.setText(this.to); // Fill the buffer with the 'to' text
        entries.get(0).setValue(valuebuf);
        valuebuf.setFixedPoint(this.amount.toString()); // Fill the buffer with the amount
        entries.get(1).setValue(valuebuf);

        // Get the payload bytes
        const plbytes = new Uint8Array(message.toArrayBuffer());

        // Get signature
        this.signature = wallet.sign(this.sender_sk, plbytes);
        const sigbuf = helpers.str2ab(this.signature);
        const msig = metadata.initSignature(sigbuf.byteLength);
        msig.copyBuffer(sigbuf);

        // Calculate POW
        this.pow = pow.find(plbytes).pow;
        const powbuf = helpers.str2ab(this.pow);
        const mpow = metadata.initProof(powbuf.byteLength);
        mpow.copyBuffer(powbuf);

        // Set payload of tx -- payload binary
        const pl = tx.initPayload(plbytes.byteLength);
        pl.copyBuffer(plbytes);

        this.tx = struct;

        return struct;
    }

    toBytesPacked() {
        return this.tx.toPackedArrayBuffer();
    }

    toBytes() {
        return this.tx.toArrayBuffer();
    }

    deserializePayload(i) {
        const msg = new capnp.Message(i);
        const payload = msg.getRoot(ContractPayload);
        return payload;
    }

    deserializeData(i) {
        const msg = new capnp.Message(i);
        const tx = msg.getRoot(ContractTransaction);
        return tx;
    }
}
