/**
 * StarsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * `StarsController.searchByHash()`
   */
  searchByHash: async function (req, res) {
    try {
      //get address
      let { hash } = req.allParams();

      //check for valid required parameters
      if (!hash) { return res.badRequest({err: 'address required'});};
      console.log(hash);
      return res.send(hash);
    } catch (err) {
      return res.serverError(err);
    }
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
      console.log(address);
      return res.send(address);

    } catch (err) {
      return res.serverError(err);
    }
  }
};
