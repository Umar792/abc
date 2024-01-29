const OrderModal = require("../models/OrderModal");
const ErrorHandler = require("../utils/errorHandler");

module.exports = {
  // --- create order by single ticket
  createOrder: async (req, res, next) => {
    try {
      const {
        totalamount,
        type,
        payments,
        service_fee,
        tax,
        id,
        name,
        price,
        qty,
        order_Id,
        cart,
      } = req.body;
      const newOrder = await OrderModal.create({
        user: req.user._id,
        totalAmount: totalamount,

        items: [
          {
            ticket_group_id: id,
            splits: qty,
            price: price,
            name: name,
          },
        ],
        type: type,
        shiptoName: req.user.firstName,
        shiptoEmail: req.user.email,
        payments: payments,
        service_fee: service_fee,
        tax: tax,
        order_Id: order_Id,
      });
      res.status(200).json({
        success: true,
        message: "Order created successfully",
        // newOrder,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // ---- get user all orders
  getUserOrders: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const orders = await OrderModal.find({ user: userId });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
};
