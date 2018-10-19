/**
 * BlockController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const Block = require("./Block");
 const Blockchain = require("./Blockchain");
 global.blockchain = global.blockchain || new Blockchain();

 module.exports = {
  /**
   * `BlockController.create()`
   */
  create: async function (req, res) {
      try {
        //get description from req params
        let {description} = req.allParams();
        if (!description) {
          return res.badRequest({err: 'block description is required'});
        }

        //add block
        global.blockchain.addBlock(new Block(description)).then((block) => {
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
    return res.json({
      todo: 'findOne() is not implemented yet!'
    });
  }

};
