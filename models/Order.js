const mongoose = require("mongoose");

const OrderSchema = mongoose.model("order", new mongoose.Schema({
    orderid: String,
    selected: Object
}));

// Save an order in progress throught RazorPay
module.exports.saveOrder = async function (orderid, selected) {
    await OrderSchema.create({ orderid: orderid, selected: selected });
}

// Get a saved order to update the user after successful payment
module.exports.getOrder = async function (orderid) {
    const orderObj = await OrderSchema.findOne({ orderid: orderid });
    return orderObj;
}