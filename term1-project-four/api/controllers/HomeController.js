/**
 * HomeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * `HomeController.index()`
   */
  index: async function (req, res) {
    return res.json({
      message: 'Welcome to the star notary service'
    });
  }

};
