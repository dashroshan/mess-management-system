// Import required modules
const express = require("express");
const router = express.Router();
const Razorpay = require('razorpay');

// Import database models
const Buyer = require('../models/Buyer');
const Time = require('../models/Time');
const Order = require('../models/Order');

// Import RazorPay payment validator
var { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');

// Get the user secret and meals purchased
router.get(
    "/data",
    async (req, res) => {
        res.send(await Buyer.getBuyer(req.user?.email));
    }
);

// Reset the user secret
router.get(
    "/resetSecret",
    async (req, res) => {
        res.send(await Buyer.resetSecret(req.user?.email));
    }
);

// Check if the user's coupon is valid for the current day and meal
router.post(
    "/checkCoupon",
    async (req, res) => {
        res.send(await Buyer.checkCoupon(req.body));
    }
);

// Check if the user has already bought coupons for the next week
router.get(
    "/boughtNextWeek",
    async (req, res) => {
        res.send(await Buyer.boughtNextWeek(req.user?.email));
    }
);

// Check if the payment throught RazorPay is successful
router.post(
    "/checkOrder",
    async (req, res) => {
        const isValid = validatePaymentVerification({ "order_id": req.body.razorpay_order_id, "payment_id": req.body.razorpay_payment_id }, req.body.razorpay_signature, process.env.PAY_SECRET);
        if (isValid) {
            const orderObj = await Order.getOrder(req.body.razorpay_order_id);
            await Buyer.saveOrder(req.user?.email, orderObj.selected);
        }
        res.send(isValid);
    }
);

// Create a RazorPay order and send the order id to frontend
router.post(
    "/createOrder",
    async (req, res) => {
        let costs = await Time.getTimes();
        let data = {};
        for (let c of costs) data[c.meal] = c.cost;
        let total = 0;
        for (const [day, val] of Object.entries(req.body.selected)) {
            if (val.breakfast === true) total += data.breakfast;
            if (val.lunch === true) total += data.lunch;
            if (val.dinner === true) total += data.dinner;
        }

        let instance = new Razorpay({ key_id: process.env.PAY_ID, key_secret: process.env.PAY_SECRET });
        let resp = await instance.orders.create({
            amount: total * 100,
            currency: "INR"
        });
        await Order.saveOrder(resp.id, req.body.selected);
        res.send(resp);
    }
);

module.exports = router;