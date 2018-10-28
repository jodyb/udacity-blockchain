/**
 * ValidationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * `ValidationController.requestValidation()`
   */
  requestValidation: async function (req, res) {

    try {
      //get address from req params
      let {address} = req.allParams();
      //check that address is present
      if (!address) {
        return res.badRequest({err: 'Wallet address is required'});
      }

      let requestTimeStamp = Math.round(new Date().getTime() / 1000);
      let message = `${address}:${requestTimeStamp}:starRegistry`;
      const validationWindow = 300;  //five minutes - 300 seconds

      return res.json({
        "address": address,
        "requestTimeStamp": requestTimeStamp,
        "message": message,
        "validationWindow": validationWindow
      });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
