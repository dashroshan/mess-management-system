const mongoose = require("mongoose");

const BuyerSchema = mongoose.model("buyer", new mongoose.Schema({
    email: String,
    secret: String,
    bought: Boolean,
    this: {
        monday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        tuesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        wednesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        thursday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        friday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        saturday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        sunday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        }
    },
    next: {
        monday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        tuesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        wednesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        thursday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        friday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        saturday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        sunday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        }
    }
}));

// Get the user details, or if it doesn't exists, create a new user object
module.exports.getBuyer = async function (email) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let randomStr = "";
    for (let i = 0; i < 4; i++)
        randomStr += charset[Math.floor(Math.random() * charset.length)];

    const Buyer = await BuyerSchema.findOneAndUpdate(
        { email: email },
        {
            $setOnInsert: {
                bought: false,
                secret: randomStr,
                this: {
                    monday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    tuesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    wednesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    thursday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    friday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    saturday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    sunday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    }
                },
                next: {
                    monday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    tuesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    wednesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    thursday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    friday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    saturday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    sunday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    }
                }
            }
        },
        { new: true, upsert: true }
    ).select({ _id: 0 });
    return Buyer;
}

// Resets the user secret and returns the updated user object
module.exports.resetSecret = async function (email) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let randomStr = "";
    for (let i = 0; i < 4; i++)
        randomStr += charset[Math.floor(Math.random() * charset.length)];

    const Buyer = await BuyerSchema.findOneAndUpdate(
        { email: email },
        { secret: randomStr }).select({ _id: 0 });
    return Buyer;
}

// Check if the user's coupon is valid for the current day and meal
module.exports.checkCoupon = async function (data) {
    const Buyer = await BuyerSchema.findOne({ email: data.email, secret: data.secret });
    if (Buyer == null) return false;
    if (Buyer.this[data.day][data.type]) {
        await BuyerSchema.updateOne({ email: data.email }, { ["this." + data.day + "." + data.type]: false });
        return true;
    }
    return false;
}

// Save the purchased coupons after a successful payment
module.exports.saveOrder = async function (email, data) {
    await BuyerSchema.updateOne({ email: email }, { next: data, bought: true });
}

// Check if the user has already bought the coupons for the coming week
module.exports.boughtNextWeek = async function (email) {
    await module.exports.getBuyer(email);
    const Buyer = await BuyerSchema.findOne({ email: email });
    return Buyer.bought;
}

// Returns details of all the users
module.exports.allBuyers = async function () {
    const Buyers = await BuyerSchema.find({});
    return Buyers;
}