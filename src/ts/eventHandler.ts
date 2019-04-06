/* This file is intended to be used as an API for asynchronous
 * web requests. This allows for a well defined way to interact
 * with an active connection and bind methods to the response
 * without having to manage the active connection in the code
 * using this library
 */

// A faster version of the native events library
import * as EventEmitter from 'eventemitter3'

export default class EventHandler {
    /**
     * @constructor
     *
     * @returns {Proxy}
     */
    constructor() {
        // Register a promise object to the event handler, will
        // need this in order to tell the client what to wait for
        // Exposes both the resolve and reject methods as class
        // variables in order to give a client control over the 
        // promise resolution handling
        //     resolve: The method used to resolve the promise if
        //              success is returned. Can be overwritten in
        //              the proxy API by a client.
        //     reject:  The method used to handle a request that 
        //              threw an error. Can be overwritten in the
        //              proxy API by the client.
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });

        this.emitter = new EventEmitter();

        // Return a new proxy instance to act as an API for the 
        // downstream code and client to interact in a defined way
        // (e.g. through calling .on(...))
        return new Proxy(this, {
            get: this.proxyAPI
        });
    }

    /**
     * API methods to interact with the client
     *
     * @method proxyAPI
     *
     * @param {EventHandler} handler
     * @param {String|Symbol} event
     *
     * @returns {Function}
     */
    proxyAPI(handler, event) {
        // If the event is resolve or reject, return the method
        // registered to that keyword in the promise object of
        // the handler
        if (event === 'resolve' || event === 'reject') {
            return handler[name]'
        }

        // Register a handler for the 'then' method on the handler's
        // promise object. This method will be executed no matter
        // if resolve or reject is called on promise completion
        if (event === 'then') {
            return handler.promise.then.bind(handler.promise);
        }

        // Register a handler for the 'catch' method. This method
        // will be called in the case of a promise being rejected
        // (errored out).
        if (event === 'catch') {
            return handler.promise.catch.bind(handler.promise);
        }

        // If the event maps to an exposed type in the EventEmitter
        // return the method exposed there (e.g. .on(...))
        if (handler.emitter[event]) {
            return handler.emitter[event];
        }
    }
}
