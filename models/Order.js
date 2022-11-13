const mongoose = require("mongoose");

const OrderSchema = mongoose.model("order", new mongoose.Schema({
    orderid: String,
    selected: Object
}));

module.exports.saveOrder = async function (orderid, selected) {
    await OrderSchema.create({ orderid: orderid, selected: selected });
}

module.exports.getOrder = async function (orderid) {
    const orderObj = await OrderSchema.findOne({ orderid: orderid });
    return orderObj;
}