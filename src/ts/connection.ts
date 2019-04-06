import * as contract from './contract';
import * as EventHandler from './eventHandler';
import * as helpers from './helpers';

// The connection class is a helper to allow a client to naively
// submit a transaction to a set of nodes without needing to know
// the underlying protocols.
export class Connection {
    _nodes: Array<string>;
    _eventHandler: EventHandler;

    /**
     * @constructor
     *
     * @param {Array<string>} nodes
     * @param {number} timeout (expressed in ms)
     */
    constructor(nodes: Array<string>, timeout?: number) {
        // Register an event handler object to the connection
        // object so we can do async promises and event emission
        // properly.
        this._eventHandler = new EventHandler();

        // Set the internal set of nodes to the provided set of nodes
        // TODO: Maybe add a config file to set things like this?
        this._nodes = nodes;

        // Set the timeout on a class level so it is easier to
        // interact with by the end-user. Default it to timeout
        // of 0 which means no timeout
        this._timeout = timeout || 0;
    }
    
    /**
     * Send a tx when representation is ContractTransactionContainer
     *
     * @method send
     * 
     * @param {ContractTransactionContainer} tx
     *
     * @returns {Promise}
     */
    async send_tx(tx: contract.ContractTransactionContainer) {
        const resp = await this._send_tx(tx.toBytesPacked());
        return resp.result;
    }

    /**
     * Send a tx when representation is ArrayBuffer
     *
     * @method send
     *
     * @param {ArrayBuffer} tx
     *
     * @returns {Promise}
     */
    async send_tx(tx: ArrayBuffer) {
        const resp = await this._send_tx(tx);
        return resp.result;
    }

    /**
     * Send a tx when representation is string of bytes
     *
     * @method send
     *
     * @param {string} tx
     * 
     * @returns {Promise}
     */
    async send_tx(tx: string) {
        const resp = await this._send_tx(helpers.str2ab(tx));
        return resp.result;
    }

    /**
     * Underlying method for sending a transaction in a common
     * transformed format
     *
     * @method _send
     *
     * @param {ArrayBuffer} tx
     *
     * @returns {Promise}
     */
    _send_tx(tx: ArrayBuffer) {
        return new Promise((resolve, reject) => {
            // Get the request object to use for this
            const request = this._get_request_object();

            // Setup the method to process a state change
            // native to XMLHttpRequest
            request.onreadystatechange = () => {
                // READYSTATE LIST: 0=UNSENT, 1=OPENED, 2=HEADERS_RECEIVED
                //                  3=LOADING, 4=DONE
                // If done, process
                if (request.readyState === 4) {
                    // Check if we received a valid HTTP endpoint. If it is complete
                    // but there is no status or response, we know the endpoint
                    // provided is invalid
                    if (request.response === null && request.status === 0) {
                        reject(new Error(`Connection refused or URL could not be resolved: ${request.requestURL}`));
                    }

                    if (request.status === 200) {
                        // Attempt to return parsed JSON. This process may not
                        // work for all masternode endpoints since not all of
                        // them return JSON
                        try {
                            return resolve(JSON.parse(request.responseText));
                        } catch (error) {
                            reject(new Error(`Response was not valid JSON as expected: ${request.responseText}`));
                        }
                    }
                }
            };

            // Register the functionality on what should happen if a
            // timeout occurs
            request.ontimeout = () => {
                reject(new Error(`Unable to connect to URL ${request.requestURL} after ${this._timeout}ms`))
            }

            // Send the request
            try {
                request.send(tx);
            } catch (error) {
                reject(error);
            }
        });

    }


    /**
     * Get the request object to use for the connection operations
     * Written as a method to allow extensibility in the future
     * if the meta-structure of the request object should change.
     *
     * @method _get_request_object
     *
     * @returns {XMLHttpRequest}
     */
    _get_request_object() {
        var request = new XMLHttpRequest();
        var node = this._get_random_node();

        request.open('POST', node, true);
        request.timeout = this._timeout;
    }
    
    /**
     * Gets a pseudo-random node from the provided list of nodes
     *
     * @method _get_random_node
     *
     * @throws NoNodesError
     *
     * @returns {string}
     */
    _get_random_node() {
        if (this._nodes === undefined || this._nodes.length == 0) {
            throw "No nodes have been provided to the connection object, please provide them as the first argument to the constructor (e.g. new Connection([<node1>, <node2>])) or by calling the set method for nodes."
        } else {
            return this._nodes[Math.floor(Math.random() * this._nodes.length)];
        }
    }

    /**
     * Set the nodes for the class
     *
     * @property nodes
     *
     * @param {Array<string>} nodes
     */
    set nodes(nodes: Array<string>) {
        this._nodes = nodes;
    }

    /**
     * Set the timeout for the class
     *
     * @property timeout
     *
     * @param {number} timeout (expressed in ms)
     */
    set timeout(timeout: number) {
        this._timeout = timeout;
    }
}
