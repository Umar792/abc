var braintree = require("braintree");
const ErrorHandler = require("../utils/errorHandler");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAIN_TREE_merchantId ,
  publicKey: process.env.BRAIN_TREE_publicKey,
  privateKey: process.env.BRAIN_TREE_privateKey,
});

module.exports = {
  // --- generate the clientToken
  generateToken: async (req, res, next) => {
    try {
      const clientToken = await gateway.clientToken.generate();
      res.status(200).json({
        success: true,
        clientToken: clientToken.clientToken,
      });
    } catch (error) {
      next(new ErrorHandler(error, 400));
    }
  },
  // ---- payment process
  paymentProcess: async (req, res, next) => {
    try {
      const nonceFromTheClient = req.body.payment_method_nonce;
      const { amount } = req.body;
      // ---- generate the payment
      gateway.transaction
        .sale({
          amount: amount,
          paymentMethodNonce: nonceFromTheClient,
          options: {
            submitForSettlement: true,
          },
        })
        .then((responsedata) => {
          res.status(200).send(responsedata);
        })
        .catch((err) => {
          res.status(400).send(responsedata);
        });
    } catch (error) {
      next(new ErrorHandler(error, 400));
    }
  },
};
