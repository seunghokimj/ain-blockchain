'use strict';

const getJsonRpcApi = require('./methods_impl');

/**
 * Defines the list of funtions which are accessibly to clients through the
 * JSON-RPC calls
 *
 * @param {Blockchain} blockchain Instance of the Blockchain class.
 * @param {TransactionPool} transactionPool Instance of the TransactionPool class.
 * @param {P2pServer} p2pServer Instance of the the P2pServer class.
 * @return {dict} A closure of functions compatible with the jayson library for
 *                  servicing JSON-RPC requests.
 */
module.exports = function getMethods(blockchain, transactionPool, p2pServer) {
  const methodsImpl = getJsonRpcApi(blockchain, transactionPool, p2pServer);
  return {
    // Bloock API
    ain_getBlockList: function(args, done) {
      const queryDict = getQueryDict(args);
      const blocks = methodsImpl.blockchainClosure.getBlockBodies(queryDict);
      done(null, blocks);
    },

    ain_getLastBlock: function(args, done) {
      const block = methodsImpl.blockchainClosure.getLastBlock();
      done(null, block);
    },

    ain_getBlockHeadersList: function(args, done) {
      const queryDict = getQueryDict(args);
      const blockHeaders = methodsImpl.blockchainClosure.getBlockHeaders(queryDict);
      done(null, blockHeaders);
    },

    ain_getBlockByHash: function(args, done) {
      const hashSubstring = getQueryDict(args);
      const block = methodsImpl.blockchainClosure.getBlockByHash(hashSubstring);
      done(null, (block === null) ? null: block.body());
    },

    ain_getBlockHeaderByHash: function(args, done) {
      const hashSubstring = getQueryDict(args);
      const block = methodsImpl.blockchainClosure.getBlockByHash(hashSubstring);
      done(null, (block === null) ? null: block.header());
    },

    ain_getBlockByNumber: function(args, done) {
      const height = getQueryDict(args);
      const block = methodsImpl.blockchainClosure.getBlockByNumber(height);
      done(null, (block === null) ? null: block.body());
    },

    ain_getBlockHeaderByNumber: function(args, done) {
      const height = getQueryDict(args);
      const block = methodsImpl.blockchainClosure.getBlockByNumber(height);
      done(null, (block === null) ? null: block.header());
    },

    ain_getForgerByHash: function(args, done) {
      const hashSubstring = getQueryDict(args);
      const block = methodsImpl.blockchainClosure.getBlockByHash(hashSubstring);
      done(null, (block === null) ? null: block.body().forger);
    },

    ain_getForgerByNumber: function(args, done) {
      const height = getQueryDict(args);
      const block = methodsImpl.blockchainClosure.getBlockByNumber(height);
      done(null, (block === null) ? null: block.body().forger);
    },

    ain_getValidatorsByNumber: function(args, done) {
      const height = getQueryDict(args);
      const block = methodsImpl.blockchainClosure.getBlockByNumber(height);
      done(null, (block === null) ? null: block.header().validators);
    },

    ain_getValidatorsByHash: function(args, done) {
      const hashSubstring = getQueryDict(args);
      const block = methodsImpl.blockchainClosure.getBlockByHash(hashSubstring);
      done(null, (block === null) ? null: block.header().validators);
    },

    ain_getBlockTransactionCountByHash: function(args, done) {
      const hashSubstring = getQueryDict(args);
      const block = methodsImpl.blockchainClosure.getBlockByHash(hashSubstring);
      done(null, (block === null) ? null: block.body().data.length);
    },

    ain_getBlockTransactionCountByNumber: function(args, done) {
      const height = getQueryDict(args);
      const block = methodsImpl.blockchainClosure.getBlockByNumber(height);
      done(null, (block === null) ? null: block.body().data.length);
    },

    // Transaction API
    ain_getPendingTransactions: function(args, done) {
      const trans = methodsImpl.transactionPoolClosure.getTransactions();
      done(null, trans);
    },

    ain_sendTransaction: function(args, done) {
      const transaction = getQueryDict(args);
      done(null, methodsImpl.p2pServerClosure.executeTransaction(transaction));
    },

    ain_getTransactionByBlockHashAndIndex: function(args, done) {
      const queryDict = getQueryDict(args);
      let result;
      if (!queryDict.blockHash || !queryDict.index) {
        result = null;
      } else {
        const index = Number(queryDict.index);
        const block = methodsImpl.blockchainClosure.getBlockByHash(queryDict.blockHash);
        result = block.data.length > index ? block.data[index] : null;
      }
      done(null, result);
    },

    ain_getTransactionByBlockNumberAndIndex: function(args, done) {
      const queryDict = getQueryDict(args);
      let result;
      if (!queryDict.blockNumber || !queryDict.index) {
        result = null;
      } else {
        const index = Number(queryDict.index);
        const block = methodsImpl.blockchainClosure.getBlockByNumber(queryDict.blockNumber);
        result = block.data.length > index && index > 0 ? block.data[index] : null;
      }
      done(null, result);
    },
  };
};

function getQueryDict(args) {
  return (typeof args === 'undefined' || args.length < 1) ? {} : args[0];
}
