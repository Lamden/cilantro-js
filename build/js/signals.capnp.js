/* tslint:disable */
import { ObjectSize as __O, Struct as __S } from 'capnp-ts';
export const _capnpFileId = "df5825258a6a807b";
export class Signal extends __S {
    getMessageType() { return __S.getUint32(0, this); }
    setMessageType(value) { __S.setUint32(0, value, this); }
    toString() { return "Signal_" + super.toString(); }
}
Signal._capnp = { displayName: "Signal", id: "818477010daf6e1b", size: new __O(8, 0) };
export class ExternalSignal extends __S {
    getId() { return __S.getUint32(0, this); }
    setId(value) { __S.setUint32(0, value, this); }
    getTimestamp() { return __S.getUint32(4, this); }
    setTimestamp(value) { __S.setUint32(4, value, this); }
    adoptSender(value) { __S.adopt(value, __S.getPointer(0, this)); }
    disownSender() { return __S.disown(this.getSender()); }
    getSender() { return __S.getData(0, this); }
    hasSender() { return !__S.isNull(__S.getPointer(0, this)); }
    initSender(length) { return __S.initData(0, length, this); }
    setSender(value) { __S.copyFrom(value, __S.getPointer(0, this)); }
    adoptSignature(value) { __S.adopt(value, __S.getPointer(1, this)); }
    disownSignature() { return __S.disown(this.getSignature()); }
    getSignature() { return __S.getData(1, this); }
    hasSignature() { return !__S.isNull(__S.getPointer(1, this)); }
    initSignature(length) { return __S.initData(1, length, this); }
    setSignature(value) { __S.copyFrom(value, __S.getPointer(1, this)); }
    toString() { return "ExternalSignal_" + super.toString(); }
}
ExternalSignal._capnp = { displayName: "ExternalSignal", id: "8ebda057f9c00097", size: new __O(8, 2) };
export class ExternalMessage extends __S {
    adoptData(value) { __S.adopt(value, __S.getPointer(0, this)); }
    disownData() { return __S.disown(this.getData()); }
    getData() { return __S.getData(0, this); }
    hasData() { return !__S.isNull(__S.getPointer(0, this)); }
    initData(length) { return __S.initData(0, length, this); }
    setData(value) { __S.copyFrom(value, __S.getPointer(0, this)); }
    adoptSender(value) { __S.adopt(value, __S.getPointer(1, this)); }
    disownSender() { return __S.disown(this.getSender()); }
    getSender() { return __S.getData(1, this); }
    hasSender() { return !__S.isNull(__S.getPointer(1, this)); }
    initSender(length) { return __S.initData(1, length, this); }
    setSender(value) { __S.copyFrom(value, __S.getPointer(1, this)); }
    adoptSignature(value) { __S.adopt(value, __S.getPointer(2, this)); }
    disownSignature() { return __S.disown(this.getSignature()); }
    getSignature() { return __S.getData(2, this); }
    hasSignature() { return !__S.isNull(__S.getPointer(2, this)); }
    initSignature(length) { return __S.initData(2, length, this); }
    setSignature(value) { __S.copyFrom(value, __S.getPointer(2, this)); }
    toString() { return "ExternalMessage_" + super.toString(); }
}
ExternalMessage._capnp = { displayName: "ExternalMessage", id: "bac54a528df98ba7", size: new __O(0, 3) };
export class SignedMessage extends __S {
    getMsgType() { return __S.getUint16(0, this); }
    setMsgType(value) { __S.setUint16(0, value, this); }
    adoptMessage(value) { __S.adopt(value, __S.getPointer(0, this)); }
    disownMessage() { return __S.disown(this.getMessage()); }
    getMessage() { return __S.getData(0, this); }
    hasMessage() { return !__S.isNull(__S.getPointer(0, this)); }
    initMessage(length) { return __S.initData(0, length, this); }
    setMessage(value) { __S.copyFrom(value, __S.getPointer(0, this)); }
    adoptSignature(value) { __S.adopt(value, __S.getPointer(1, this)); }
    disownSignature() { return __S.disown(this.getSignature()); }
    getSignature() { return __S.getData(1, this); }
    hasSignature() { return !__S.isNull(__S.getPointer(1, this)); }
    initSignature(length) { return __S.initData(1, length, this); }
    setSignature(value) { __S.copyFrom(value, __S.getPointer(1, this)); }
    adoptSignee(value) { __S.adopt(value, __S.getPointer(2, this)); }
    disownSignee() { return __S.disown(this.getSignee()); }
    getSignee() { return __S.getData(2, this); }
    hasSignee() { return !__S.isNull(__S.getPointer(2, this)); }
    initSignee(length) { return __S.initData(2, length, this); }
    setSignee(value) { __S.copyFrom(value, __S.getPointer(2, this)); }
    getTimestamp() { return __S.getFloat64(8, this); }
    setTimestamp(value) { __S.setFloat64(8, value, this); }
    toString() { return "SignedMessage_" + super.toString(); }
}
SignedMessage._capnp = { displayName: "SignedMessage", id: "b4d13014e93861ff", size: new __O(16, 3) };
export class BadRequest extends __S {
    getTimestamp() { return __S.getUint32(0, this); }
    setTimestamp(value) { __S.setUint32(0, value, this); }
    toString() { return "BadRequest_" + super.toString(); }
}
BadRequest._capnp = { displayName: "BadRequest", id: "ba6b9f2ade0f7f3c", size: new __O(8, 0) };
export class BlockDataRequest extends __S {
    getBlockNum() { return __S.getUint32(0, this); }
    setBlockNum(value) { __S.setUint32(0, value, this); }
    toString() { return "BlockDataRequest_" + super.toString(); }
}
BlockDataRequest._capnp = { displayName: "BlockDataRequest", id: "c0cdf2c0bf16813c", size: new __O(8, 0) };
export class LatestBlockHeightRequest extends __S {
    getTimestamp() { return __S.getUint64(0, this); }
    setTimestamp(value) { __S.setUint64(0, value, this); }
    toString() { return "LatestBlockHeightRequest_" + super.toString(); }
}
LatestBlockHeightRequest._capnp = { displayName: "LatestBlockHeightRequest", id: "a3ae086310a07ff0", size: new __O(8, 0) };
export class LatestBlockHeightReply extends __S {
    getBlockHeight() { return __S.getUint32(0, this); }
    setBlockHeight(value) { __S.setUint32(0, value, this); }
    toString() { return "LatestBlockHeightReply_" + super.toString(); }
}
LatestBlockHeightReply._capnp = { displayName: "LatestBlockHeightReply", id: "81b3d0863d553fea", size: new __O(8, 0) };
export class LatestBlockHashRequest extends __S {
    getTimestamp() { return __S.getUint64(0, this); }
    setTimestamp(value) { __S.setUint64(0, value, this); }
    toString() { return "LatestBlockHashRequest_" + super.toString(); }
}
LatestBlockHashRequest._capnp = { displayName: "LatestBlockHashRequest", id: "8993ba1ea920ce90", size: new __O(8, 0) };
export class LatestBlockHashReply extends __S {
    adoptBlockHash(value) { __S.adopt(value, __S.getPointer(0, this)); }
    disownBlockHash() { return __S.disown(this.getBlockHash()); }
    getBlockHash() { return __S.getData(0, this); }
    hasBlockHash() { return !__S.isNull(__S.getPointer(0, this)); }
    initBlockHash(length) { return __S.initData(0, length, this); }
    setBlockHash(value) { __S.copyFrom(value, __S.getPointer(0, this)); }
    toString() { return "LatestBlockHashReply_" + super.toString(); }
}
LatestBlockHashReply._capnp = { displayName: "LatestBlockHashReply", id: "b2761d95c73f528e", size: new __O(0, 1) };
export class IPForVKRequest extends __S {
    adoptVk(value) { __S.adopt(value, __S.getPointer(0, this)); }
    disownVk() { return __S.disown(this.getVk()); }
    getVk() { return __S.getData(0, this); }
    hasVk() { return !__S.isNull(__S.getPointer(0, this)); }
    initVk(length) { return __S.initData(0, length, this); }
    setVk(value) { __S.copyFrom(value, __S.getPointer(0, this)); }
    toString() { return "IPForVKRequest_" + super.toString(); }
}
IPForVKRequest._capnp = { displayName: "IPForVKRequest", id: "efcc4be5a4aa72b7", size: new __O(0, 1) };
export class IPForVKReply extends __S {
    adoptIp(value) { __S.adopt(value, __S.getPointer(0, this)); }
    disownIp() { return __S.disown(this.getIp()); }
    getIp() { return __S.getData(0, this); }
    hasIp() { return !__S.isNull(__S.getPointer(0, this)); }
    initIp(length) { return __S.initData(0, length, this); }
    setIp(value) { __S.copyFrom(value, __S.getPointer(0, this)); }
    toString() { return "IPForVKReply_" + super.toString(); }
}
IPForVKReply._capnp = { displayName: "IPForVKReply", id: "8d47ee8b1ae54794", size: new __O(0, 1) };
export class Acknowledged extends __S {
    getTimestamp() { return __S.getUint32(0, this); }
    setTimestamp(value) { __S.setUint32(0, value, this); }
    toString() { return "Acknowledged_" + super.toString(); }
}
Acknowledged._capnp = { displayName: "Acknowledged", id: "abe13332a739cbe3", size: new __O(8, 0) };
