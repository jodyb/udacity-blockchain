/**
 * BlockController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const Block = require("./Block");
 const Blockchain = require("./Blockchain");
 global.blockchain = global.blockchain || new Blockchain();
 global.validatedRequests = global.validatedRequests || [];

 module.exports = {
  /**
   * `BlockController.create()`
   */
  create: async function (req, res) {
      try {
        //get parameters
        let { address, star } = req.allParams();

        //check for valid required parameters
        if (!address) { return res.badRequest({err: 'address required'});};
        if (!global.validatedRequests.includes(address)) { return res.badRequest({err: 'address not validated'});};
        if (!star) { return res.badRequest({err: 'star is required'});};
        if (!star.ra) { return res.badRequest({err: 'star right acension is required'});};
        if (!star.dec) { return res.badRequest({err: 'star declination is required'});};
        if (!star.story) { return res.badRequest({err: 'star story is required'});};

        //convert star story to hex
        star.story = Buffer.from(star.story).toString('hex')

        //add block
        global.blockchain.addBlock(new Block({address, star})).then((block) => {
          global.validatedRequests = global.validatedRequests.filter(item => item !== address); //remove request
          console.log(global.validatedRequests);
          return res.ok(block);
        })
      } catch (err) {
        return res.serverError(err);
      }
  },

  /**
   * `BlockController.findOne()`
   */
  findOne: async function (req, res) {
    try {
      //get requested height from req params
      let {height} = req.allParams();
      global.blockchain.getBlockHeight().then((blockHeight) => {
        //check for valid blockheight
        if (height < 0 || height > blockHeight) {
          return res.badRequest({err: 'request outside of block range'});
        }
        global.blockchain.getBlock(height).then((block) => {
          block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString('ascii');
          return res.ok(block);
        })
      })
    } catch (err) {
      return res.serverError(err);
    }
  }
};
