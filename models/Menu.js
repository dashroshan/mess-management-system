const mongoose = require("mongoose");

const MenuSchema = mongoose.model("menuitem", new mongoose.Schema({
    day: String,
    breakfast: String,
    lunch: String,
    dinner: String
}));

module.exports.getMenu = async function () {
    const menuItems = await MenuSchema.find({})
        .select({ _id: 0 });
    return menuItems;
}

module.exports.setMenus = async function (menus) {
    await MenuSchema.deleteMany({});
    await MenuSchema.insertMany(menus);
}