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
   */
  searchByHash: async function (req, res) {
    return res.json({
      todo: 'searchByHash() is not implemented yet!'
    });
  },

  /**
   * `StarsController.searchByAddress()`
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
