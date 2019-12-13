import * as capnp from 'capnp-ts';
import { TransactionPayload, Transaction } from './transaction.capnp';
import { Value } from './values.capnp';
import * as wallet from './wallet';
import * as pow from './pow';

declare const Buffer;

export class TransactionBuilder {
    //Capnp TransactionPayload
    payloadMessage: capnp.Message;
    payload: any;
    payloadBytes: any;
    sender: string;
    stamps: number;
    processor: any;
    contract: string;
    func: string;
    nonce: number;
    kwargs: any;

    //Capnp Transaction
    transactionMessage: capnp.Message;
    transaction: any;
    transactionMetadata: any;
    signature: any;
    proof: any;
    transactionPayload: any;
    transactonBytes: any;

    //Network Respones
    nonceResponse: any;
    nonceResult: any;
    transactionResponse: any;
    transactionResult: any;
    
    //Flags
    proofGenerated: boolean;
    transactionSigned: boolean;

    constructor(sender: string, contract: string, func: string, kwargs: any, stamps: number, nonce: number = undefined, processor: any = undefined){
        //Stores variables in self for convenience
        this.sender = sender;
        this.stamps = stamps;
        this.contract = contract;
        this.func = func;
        this.kwargs = kwargs;
        this.nonce = nonce;
        this.processor = processor;

        this.proofGenerated = false;
        this.transactionSigned = false;

        //Create Capnp messages and transactionMessages
        this.payloadMessage = new capnp.Message();
        this.payload = this.payloadMessage.initRoot(TransactionPayload);

        this.transactionMessage = new capnp.Message();
        this.transaction = this.transactionMessage.initRoot(Transaction);
        this.transactionMetadata = this.transaction.initMetadata();
        this.transaction.initPayload();

        //Start creating Payload by setting the values in the capnp message
        //Set Nonce will need to called externally to compelte the Payload
        this.setSender(this.sender);
        this.setContract(this.contract);
        this.setFunctionName(this.func);
        this.setStamps(this.stamps);
        this.setKwargsInPayload();
                
        
        //If Nonce or Processor are not provided then getNonce can be called to set both from the masternode
        if (this.nonce != null) this.setNonce(this.nonce);
        if (this.processor != null) this.setProcessor(this.processor);
    }
    
    numberToUnit64(number: number) {
        if (number == null) return;
        return capnp.Uint64.fromNumber(number);
    }

    isStringHex(string: string = '') {
        let hexRegEx = /([0-9]|[a-f])/gim
        return typeof string === 'string' &&
        (string.match(hexRegEx) || []).length === string.length
    }

    hexStringToByte(string: string = '') {
        let a = [];
        for (let i = 0, len = string.length; i < len; i+=2) {
            a.push(parseInt(string.substr(i,2),16));
        }
        return new Uint8Array(a);
    }

    stringToArrayBuffer(string) {
        var buffer = new ArrayBuffer(string.length);
        var bufferView = new Uint8Array(buffer);
        for (var i=0, strLen=string.length; i<strLen; i++) {
          bufferView[i] = string.charCodeAt(i);
        }
        return buffer;
    }

    kwargsCount() {
        return Object.keys(this.kwargs).length;
    }

    setKwargsInPayload() {
        let kwargs = this.payload.initKwargs();
        let kwargsEntries = kwargs.initEntries(this.kwargsCount());

        if (this.kwargsCount() > 0){
            Object.keys(this.kwargs).map((key, index) => {
                //Check for type and value object properties
                this.vaildateKwarg(key, this.kwargs[key]);

                //Create a value pointer to set the Key (text)
                // ** This does not compile in Typescript but does create the correct
                // result in javascript.  This is uncommented in the javascript implementation
                // but commented in TS so it can compile.

                //*** UNCOMMENT  */
                //let keyMessage = new capnp.Message().initRoot(capnp.Text);
                //keyMessage.set(0, key)
                //kwargsEntries.get(index).setKey(keyMessage)
                //*** UNCOMMENT  */

                //Set the assocaited Value for the kwarg entry
                kwargsEntries.get(index).setValue(this.mapTypes(this.kwargs[key]));
            });
        }
    }

    vaildateKwarg(key: string = undefined, value: any) {
        //Match what the user provided as the type typeof results with.
        const typeLookup = {
            bool: "boolean",
            fixedPoint: "number",
            text: "string",
            data: "string"
        };
        if (key == null)
            //Error if key not provided
            throw new TypeError(`"key" cannot be empty string`);
        if (value.type === undefined)
            //Error if the user did not specifiy the type of kwarg data
            throw new TypeError(`"${key}" kwarg has no type (bool, string, uint64, fixedPoint)`);
        if (!typeLookup.hasOwnProperty(value.type))
            //Error if the user did not specifiy the type of kwarg data
            throw new TypeError(`Data type "${value.type}" is not supported by Lamden at this time.  Supported type are ${Object.keys(typeLookup).toString}`);
        if (value.value === undefined)
            //Error if the user did not specifiy any kwarg data
            throw new TypeError(`"${key}" kwarg has no value property.`);
        let valueType = typeof value.value;
        if (valueType !== typeLookup[value.type])
            //Error if the user supplied type does not match the actual kwarg data type
            throw new TypeError(`"${key}" kwarg value is incorrect type or type assignment is incorrect. Recieved value of type "${valueType}" with type property "${value.type}"`);
        if(value.type === 'data' && !this.isStringHex(value.value))
            //Make sure the value for data type can covert to hex
            throw new TypeError(`"${key}" kwarge value should be hex for "data" type`);
    }

    mapTypes(value: any) {
        let kwargValue = value.value
        let kwargType = value.type

        //Create a Value pointer that we will set with the appropriate Type
        //depending on the value supplied by the user
        let pointer = new capnp.Message().initRoot(Value);

        const setPointerType = {
            'text': () => pointer.setText(kwargValue),
            'bool': () => pointer.setBool(kwargValue),
            'fixedPoint': () => pointer.setFixedPoint(kwargValue),
            'data': () => {
                let dataBuffer = this.hexStringToByte(kwargValue);
                let dataPointer = pointer.initData(dataBuffer.length);
                dataPointer.copyBuffer(dataBuffer);
            },
        };
        try{
            setPointerType[kwargType]();
        } catch (e){
            throw new Error(`Could not set value ${kwargValue} with type ${kwargType}. Error: ${e}`)
        }
        return pointer;
    }

    setSender(sender: string = undefined){
        if (!this.isStringHex(sender))
            throw new TypeError(`"sender" must be a hex value`)
        if (sender == null) return;
        this.sender = sender;
        let senderBuffer = this.hexStringToByte(this.sender);
        let senderPayload = this.payload.initSender(senderBuffer.byteLength)
        senderPayload.copyBuffer(senderBuffer)
    }

    getNonce(callback: Function = undefined){
        return fetch(`http://192.168.1.141:8000/nonce/${this.sender}`)
            .then(res => {this.nonceResponse = res; return res.json()})
            .then(res => {
                this.nonceResult = res;
                this.setNonce(this.nonceResult.nonce)
                this.setProcessor(this.nonceResult.processor)
                if (callback != null) {return callback(res)}
                return this.nonceResult;
            })
            .catch(err => {throw new Error(`Unable to get nonce for ${this.sender}. Error: ${err}`)})
    }

    setNonce(nonce: number = undefined){
        if (nonce == null) return;
        this.nonce = nonce;
        this.payload.setNonce(this.numberToUnit64(this.nonce));
    }
    
    setProcessor(processor: any = undefined){
        if (processor == null) return;
        this.processor = processor;
        let processorBuffer = this.hexStringToByte(this.processor);
        let processorPayload = this.payload.initProcessor(processorBuffer.byteLength)
        processorPayload.copyBuffer(processorBuffer)
    }

    setContract(contract: string = undefined){
        if (contract == null) return;
        this.contract = contract;
        this.payload.setContractName(this.contract);
    }

    setFunctionName(func: string = undefined){
        if (func == null) return;
        this.func = func;
        this.payload.setFunctionName(this.func);
    }

    setStamps(stamps: number = undefined){
        if (stamps == null) return;
        this.stamps = stamps;
        this.payload.setStampsSupplied(this.numberToUnit64(this.stamps));
    }

    setPayloadBytes(){
        if (this.nonce == null) throw new Error('No Nonce Set')
        if (this.processor == null) throw new Error('No Processor Set')
        //Set the Transaction Paylaod to Uint8Array so it can be signed.
        this.payloadBytes = new Uint8Array(this.payloadMessage.toPackedArrayBuffer());
    }

    sign(sk: string){
        if (this.payloadBytes == null) this.setPayloadBytes();
        // Get signature
        this.signature = wallet.sign(sk, this.payloadBytes);
        this.transactionSigned = true;

        if (wallet.verify(this.sender, this.payloadBytes, this.signature)) console.log(true)
        else console.log(false)
    }

    setSignature(){
        // Set the signature in the transcation metadata
        if (!this.transactionSigned) throw new Error(`No signature present. Use the "sign" method then try again.`)
        const signatureBuffer = this.hexStringToByte(this.signature);
        const messageSignature = this.transactionMetadata.initSignature(signatureBuffer.byteLength);
        messageSignature.copyBuffer(signatureBuffer);
    }

    generate_proof(){
        // Generate a proof of work from the payloadBytes
        if (this.payloadBytes == null) this.setPayloadBytes()
        this.proof = pow.find(this.payloadBytes).pow;
        this.proofGenerated = true;
    }

    setProof(){
        // Store the proof of work in the transaction metadata
        if (!this.proofGenerated) this.generate_proof();
        const proofBuffer = this.hexStringToByte(this.proof);
        const messageProof = this.transactionMetadata.initProof(proofBuffer.byteLength);
        messageProof.copyBuffer(proofBuffer);        
    }

    setTimeStamp(){
        // Store timstamp in the transaction metadata
        this.transactionMetadata.setTimestamp(+new Date);
    }

    setTransactionPayload() {
        // Store Transaction Payload in the transaction
        this.transaction.setPayload(this.payload);
    }

    setTransactionMetadata() {
        // Store Transaction Payload in the transaction
        this.transaction.setMetadata(this.transactionMetadata);
    }

    setTransactionBytes(){
        this.transactonBytes = this.transactionMessage.toPackedArrayBuffer();
    }

    serialize(){
        this.setTransactionPayload();
        this.setSignature();
        this.setProof();
        this.setTimeStamp();
        this.setTransactionBytes();
        return this.transactonBytes;
    }

    send(sk: string = undefined, callback: Function = undefined){
        if (sk == null && !this.transactionSigned) throw new Error(`Transation Not Signed: Private key needed to sign transaction.`)
        if (sk != null) this.sign(sk)

        const data = this.serialize();

        return fetch(`http://192.168.1.141:8000`,{
            method: 'POST',
            body: data
        })
            .then(res => {this.transactionResponse = res; return res.json()})
            .then(res => {
                this.transactionResult = res;
                if (callback != null) {return callback(res)};
                return this.transactionResult;
            })
            .catch(err => {throw new Error(err)})
    }
}