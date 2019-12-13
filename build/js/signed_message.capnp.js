/* tslint:disable */
import { ObjectSize as __O, Struct as __S } from 'capnp-ts';
export const _capnpFileId = "c8e348aff0c0e620";
export class SignedMessage extends __S {
    adoptMsgType(value) { __S.adopt(value, __S.getPointer(0, this)); }
    disownMsgType() { return __S.disown(this.getMsgType()); }
    getMsgType() { return __S.getData(0, this); }
    hasMsgType() { return !__S.isNull(__S.getPointer(0, this)); }
    initMsgType(length) { return __S.initData(0, length, this); }
    setMsgType(value) { __S.copyFrom(value, __S.getPointer(0, this)); }
    adoptMessage(value) { __S.adopt(value, __S.getPointer(1, this)); }
    disownMessage() { return __S.disown(this.getMessage()); }
    getMessage() { return __S.getData(1, this); }
    hasMessage() { return !__S.isNull(__S.getPointer(1, this)); }
    initMessage(length) { return __S.initData(1, length, this); }
    setMessage(value) { __S.copyFrom(value, __S.getPointer(1, this)); }
    adoptSignature(value) { __S.adopt(value, __S.getPointer(2, this)); }
    disownSignature() { return __S.disown(this.getSignature()); }
    getSignature() { return __S.getData(2, this); }
    hasSignature() { return !__S.isNull(__S.getPointer(2, this)); }
    initSignature(length) { return __S.initData(2, length, this); }
    setSignature(value) { __S.copyFrom(value, __S.getPointer(2, this)); }
    adoptSignee(value) { __S.adopt(value, __S.getPointer(3, this)); }
    disownSignee() { return __S.disown(this.getSignee()); }
    getSignee() { return __S.getData(3, this); }
    hasSignee() { return !__S.isNull(__S.getPointer(3, this)); }
    initSignee(length) { return __S.initData(3, length, this); }
    setSignee(value) { __S.copyFrom(value, __S.getPointer(3, this)); }
    getTimestamp() { return __S.getFloat64(0, this); }
    setTimestamp(value) { __S.setFloat64(0, value, this); }
    toString() { return "SignedMessage_" + super.toString(); }
}
SignedMessage._capnp = { displayName: "SignedMessage", id: "e4b3acf288cd199e", size: new __O(8, 4) };
