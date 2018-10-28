/**
 * ValidationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

//setup global hash for requests
global.walletAddressHash = global.walletAddressHash || {};
module.exports = {
  /**
   * `ValidationController.requestValidation()`
   */
  requestValidation: async function (req, res) {
    try {
      //get address from req params and verify it is present
      let {address} = req.allParams();
      if (!address) {
        return res.badRequest({err: 'Wallet address is required'});
      }

      //calculate validationWindow
      let requestTimeStamp = global.walletAddressHash[address];
      if (!requestTimeStamp) {
        requestTimeStamp = Math.round(new Date().getTime() / 1000)
      }
      const currentTime =  Math.round(new Date().getTime() / 1000);
      global.walletAddressHash[address] = requestTimeStamp;
      const timeSinceFirstRequest = currentTime - requestTimeStamp;

      //set up return message
      let message = `${address}:${requestTimeStamp}:starRegistry`;
      const validationWindow = 300;  //five minutes - 300 seconds
      const timeRemaining = validationWindow - timeSinceFirstRequest;

      return res.json({
        "address": address,
        "requestTimeStamp": requestTimeStamp,
        "message": message,
        "validationWindow": timeRemaining
      });
    } catch (err) {
      return res.serverError(err);
    }
  }
};
