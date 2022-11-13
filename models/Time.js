const mongoose = require("mongoose");

const TimeSchema = mongoose.model("time", new mongoose.Schema({
    meal: String,
    time: String,
    cost: Number
}));

module.exports.getTimes = async function () {
    const Times = await TimeSchema.find({})
        .select({ _id: 0 });
    return Times;
}

module.exports.setTimes = async function (times) {
    await TimeSchema.deleteMany({});
    await TimeSchema.insertMany(times);
}