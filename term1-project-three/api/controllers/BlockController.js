/**
 * BlockController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const Block = require("./Block");
 const Blockchain = require("./Blockchain");
 
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
        //create a new block
        let newBlock = new Block(description);

        //add to blockchain

        //return the new block in response
        return res.ok('all good');
      } catch (err) {
        return res.serverError(err);
      }
  },

  /**
   * `BlockController.find()`
   */
  find: async function (req, res) {
    return res.json({
      todo: 'find() is not implemented yet!'
    });
  }

};
