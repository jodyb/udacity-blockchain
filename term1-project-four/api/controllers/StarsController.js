/**
 * StarsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const Block = require("./Block");
const Blockchain = require("./Blockchain");
global.blockchain = global.blockchain || new Blockchain();

module.exports = {
  /**
   * `StarsController.searchByHash()`
   *  Requirement 2: Search by Star Block Hash
   */
  searchByHash: async function (req, res) {
    try {
      //get Star Block Hash
      let { hash } = req.allParams();
      //check for valid required parameters
      if (!hash) { return res.badRequest({err: 'star block hash required'});};
      const height = await global.blockchain.getBlockHeight();
      let starBlocks = [];
      for(i = 0; i < height; i++) {
        let block = await global.blockchain.getBlock(i);
        if (block.hash === hash) {
          block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString('ascii');
          starBlocks.push(block);
        }
      }
      return res.send(starBlocks);
    } catch (err) {
      return res.serverError(err);
    }
  },

  /**
   * `StarsController.searchByAddress()`
   * Requirement 1: Search by Blockchain Wallet Address
   */
  searchByAddress: async function (req, res) {
    try {
      //get address
      let { address } = req.allParams();
      //check for valid required parameters
      if (!address) { return res.badRequest({err: 'address required'});};
      const height = await global.blockchain.getBlockHeight()
      let starBlocks = [];
      for(i = 0; i < height; i++) {
        let block = await global.blockchain.getBlock(i);
        if (block.body.address === address) {
          block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString('ascii');
          starBlocks.push(block);
        }
      }
      return res.send(starBlocks);
    } catch (err) {
      return res.serverError(err);
    }
  }
};
