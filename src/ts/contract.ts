declare const Buffer;

import * as capnp from 'capnp-ts';
import * as md5 from 'md5';
import * as bigInt from 'big-integer';
import * as transactionSchemas from './transaction.capnp';
import * as valueSchemas from './values.capnp';
import * as helpers from './helpers';
import * as wallet from './wallet';
import * as pow from './pow';

var ContractTransaction = transactionSchemas.ContractTransaction;
var TransactionContainer = transactionSchemas.TransactionContainer;
var Metadata = transactionSchemas.MetaData;
var ContractPayload = transactionSchemas.ContractPayload;
var Kwargs = valueSchemas.Kwargs;
var Value = valueSchemas.Value;
var Map = valueSchemas.Map;

export class ContractTransactionContainer {
    tx: capnp.Message;

    constructor() {
    }

    create(contractTransaction) {
        const struct = new capnp.Message()
        const txContainer = struct.initRoot(TransactionContainer);

        const txbytes = new Uint8Array(contractTransaction.toPackedArrayBuffer());
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

export class ContractTransaction {
    sender_sk: string;
    sender: string;
    stamps_supplied: number;
    nonce: string;
    contract_name: string;
    func_name: string;
    signature: string;
    pow: string;
    tx: capnp.Message;

    constructor(contract_name, func_name) {
        this.contract_name = contract_name;
        this.func_name = func_name;
    }

    // PSUEDO-CONSTRUCTOR
    //   kwargs is reference to a dictionary object emulating the usage of kwargs in python for unknown, dynamic
    //          keyword argument assignment
    create(sender_sk, stamps_supplied, nonce, kwargobj) {
        // Fill the class objects for later use
        // These are initialized here instead of in the constructor so we can emulate having multiple
        // constructors (as with in python @class_method)
        this.sender_sk = sender_sk;
        this.stamps_supplied = stamps_supplied;
        this.nonce = nonce;

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
        const kwargcount = Object.keys(kwargobj).length; // Get the number of kwargs supplied via the kwarg object for
                                                         // the dynamic section of the transaction container
        const entries = kwargs.initEntries(kwargcount); // Set to static length of 2 for currency contract

        // Cast required inputs to capnp types
        const stamps = capnp.Uint64.fromNumber(this.stamps_supplied);

        // Build the deterministic section of the payload
        payload.setContractName(this.contract_name);
        payload.setFunctionName(this.func_name);
        payload.setNonce(this.nonce);
        payload.setSender(wallet.get_vk(this.sender_sk));
        payload.setStampsSupplied(stamps);

        // Build the non-deterministic section of the payload (kwargs)
        Object.entries(kwargobj).forEach(function (value, i) {
            // Set the key to the entry (foreach on on object will give [ [ <key>, <value> ], ... ]
            entries.get(i).setKey(value[0]);
            // Set the value based on the provided type
            switch (value[1]["type"]) {
                default:
                    throw "argument type " + value[1]["type"] + " is either unknown or unsupported by cilantro-js";
                case 'bool':
                    if (typeof value[1]['value'] === "boolean") {
                        entries.get(i).setBool(value[1]['value']);
                    } else {
                        throw "Value provided to key '" + value[0] + "' of '" + value[1]['value'] + "' did not match expected type '" + value[1]['type'] + "'";
                    }
                    break;
                case 'uint64':
                    break;
                case 'fixedPoint':
                    if (typeof value[1]['value'] === "number") {
                        entries.get(i).setFixedPoint(value[1]['value'].toString());
                    } else {
                        throw "Value provided to key '" + value[0] + "' of '" + value[1]['value'] + "' did not match expected type '" + value[1]['type'] + "'";
                    }
                    break;
                case 'text':
                    if (typeof value[1]['value'] === "string") {
                        entries.get(i).setText(value[1]['value']);
                    } else {
                        throw "Value provided to key '" + value[0] + "' of '" + value[1]['value'] + "' did not match expected type '" + value[1]['type'] + "'";
                    }
                    break;
                case 'data':
                    break;
            }
        });
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
