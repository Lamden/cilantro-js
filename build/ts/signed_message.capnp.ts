/* tslint:disable */

/**
 * This file has been automatically generated by the [capnpc-ts utility](https://github.com/jdiaz5513/capnp-ts).
 */

import * as capnp from "capnp-ts";
import { ObjectSize as __O, Struct as __S } from 'capnp-ts';
export const _capnpFileId = "c8e348aff0c0e620";
export class SignedMessage extends __S {
    static readonly _capnp = { displayName: "SignedMessage", id: "e4b3acf288cd199e", size: new __O(8, 4) };
    adoptMsgType(value: capnp.Orphan<capnp.Data>): void { __S.adopt(value, __S.getPointer(0, this)); }
    disownMsgType(): capnp.Orphan<capnp.Data> { return __S.disown(this.getMsgType()); }
    getMsgType(): capnp.Data { return __S.getData(0, this); }
    hasMsgType(): boolean { return !__S.isNull(__S.getPointer(0, this)); }
    initMsgType(length: number): capnp.Data { return __S.initData(0, length, this); }
    setMsgType(value: capnp.Data): void { __S.copyFrom(value, __S.getPointer(0, this)); }
    adoptMessage(value: capnp.Orphan<capnp.Data>): void { __S.adopt(value, __S.getPointer(1, this)); }
    disownMessage(): capnp.Orphan<capnp.Data> { return __S.disown(this.getMessage()); }
    getMessage(): capnp.Data { return __S.getData(1, this); }
    hasMessage(): boolean { return !__S.isNull(__S.getPointer(1, this)); }
    initMessage(length: number): capnp.Data { return __S.initData(1, length, this); }
    setMessage(value: capnp.Data): void { __S.copyFrom(value, __S.getPointer(1, this)); }
    adoptSignature(value: capnp.Orphan<capnp.Data>): void { __S.adopt(value, __S.getPointer(2, this)); }
    disownSignature(): capnp.Orphan<capnp.Data> { return __S.disown(this.getSignature()); }
    getSignature(): capnp.Data { return __S.getData(2, this); }
    hasSignature(): boolean { return !__S.isNull(__S.getPointer(2, this)); }
    initSignature(length: number): capnp.Data { return __S.initData(2, length, this); }
    setSignature(value: capnp.Data): void { __S.copyFrom(value, __S.getPointer(2, this)); }
    adoptSignee(value: capnp.Orphan<capnp.Data>): void { __S.adopt(value, __S.getPointer(3, this)); }
    disownSignee(): capnp.Orphan<capnp.Data> { return __S.disown(this.getSignee()); }
    getSignee(): capnp.Data { return __S.getData(3, this); }
    hasSignee(): boolean { return !__S.isNull(__S.getPointer(3, this)); }
    initSignee(length: number): capnp.Data { return __S.initData(3, length, this); }
    setSignee(value: capnp.Data): void { __S.copyFrom(value, __S.getPointer(3, this)); }
    getTimestamp(): number { return __S.getFloat64(0, this); }
    setTimestamp(value: number): void { __S.setFloat64(0, value, this); }
    toString(): string { return "SignedMessage_" + super.toString(); }
}
