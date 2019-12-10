import * as capnp from 'capnp-ts';
import { TransactionPayload } from './transaction.capnp';
import * as valueSchemas from './values.capnp';

const typeLookup = {
    bool: "boolean",
    integer: "number",
    decimal: "number",
    string: "string"
}


export class TransactionBuilder {
    sender: string;
    stamps: number;
    processor: any;
    contract: string;
    func: string;
    nonce: string;
    kwargs: any;
    struct: capnp.Message;
    payload: any;
    payloadBytes: any;

    signature: any;
    proof: any;
    proof_generated: boolean;
    tx_signed: boolean;

    constructor(sender: string, contract: string, func: string, kwargs: any, stamps: number, processor: any, nonce: string){
        console.log(arguments)
        
        //Stores variables in self for convenience
        this.sender = sender;
        this.stamps = stamps;
        this.processor = processor;
        this.contract = contract;
        this.func = func;
        this.nonce = nonce;
        this.kwargs = kwargs;

        //Serializes all that it can on init
        const capnpMessage = new capnp.Message();
        console.log(capnpMessage)
        console.log(TransactionPayload )
        this.payload = capnpMessage.initRoot(TransactionPayload);
        console.log(this.payload )
        console.log(this.sender )
        this.payload.setSender(this.sender);
        this.payload.setContractName(this.contract);
        this.payload.setFunctionName(this.func);
        this.payload.setStampsSupplied(this.numberToUnit64(this.stamps));
        this.payload.setProcessor(this.processor);
        this.payload.setNonce(this.nonce);
        this.setKwargsInPayload();

        this.payloadBytes = this.payload.toPackedArrayBuffer();

        this.proof_generated = false;
        this.tx_signed = false;

    }

    public numberToUnit64(number) {
        return capnp.Uint64.fromNumber(number);
    }

    public kwargsCount() {
        return Object.keys(this.kwargs).length;
    }

    public setKwargsInPayload(){
        let kwargs = this.payload.initKwargs();
        let kwargsEntries = kwargs.initEntries(this.kwargsCount());
    
        Object.keys(this.kwargs).map( (key, index) => {
            //Check for type and value object properties
            this.vaildateKwarg(key, this.kwargs[key]);

            //Set the name of the key in the payload kwargs object
            kwargsEntries.get(index).setKey(key);
            kwargsEntries.get(index).setValue(this.mapTypes(this.kwargs[key].value));
        })
    }

    public vaildateKwarg(key, value){
        if (value.type === undefined) throw new TypeError(`"${key}" kwarg has no type (bool, string, uint64, fixedPoint)`)
        if (value.value === undefined) throw new TypeError(`"${key}" kwarg has no value property.`)
        let valueType = typeof value.value;
        if (valueType !== typeLookup[value.type]) throw new TypeError(`"${key}" kwarg value is incorrect type or type assignment is incorrect. Recieved value of type "${valueType}" with type property "${value.type}"`)
    }

    public mapTypes(value) {
        let valuebuffer = new capnp.Message();
        let valueSchema = valuebuffer.initRoot(valueSchemas.Value);
        const typeLookup = {
            'string': (valueSchema, value) => valueSchema.setText(value),
            'bool': (valueSchema, value) => valueSchema.setBool(value),
            'integer': (valueSchema, value) => valueSchema.setUint64(this.numberToUnit64(value)),
            'decimal': (valueSchema, value) => valueSchema.setFixedPoint(value).toString()
        }

        return typeLookup[value.type](valueSchema, value.value)
    }
}