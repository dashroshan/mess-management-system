// Import required modules
const express = require("express");
const router = express.Router();

// Import database models
const Menu = require('../models/Menu');
const Time = require('../models/Time');
const Buyer = require('../models/Buyer');

// Set the time and cost of breakfast, lunch, dinner
router.post(
    "/setTime",
    async (req, res) => {
        await Time.setTimes(req.body.times);
        res.send();
    }
);

// Set the weekly menu
router.post(
    "/setMenu",
    async (req, res) => {
        await Menu.setMenus(req.body.menus);
        res.send();
    }
);

// Get the total meals that need to be cooked
router.post(
    "/meals",
    async (req, res) => {
        const buyers = await Buyer.allBuyers();
        let data = {
            monday: { breakfast: 0, lunch: 0, dinner: 0 },
            tuesday: { breakfast: 0, lunch: 0, dinner: 0 },
            wednesday: { breakfast: 0, lunch: 0, dinner: 0 },
            thursday: { breakfast: 0, lunch: 0, dinner: 0 },
            friday: { breakfast: 0, lunch: 0, dinner: 0 },
            saturday: { breakfast: 0, lunch: 0, dinner: 0 },
            sunday: { breakfast: 0, lunch: 0, dinner: 0 }
        }
        for (let buyer of buyers) {
            let meals = buyer[req.body.week];
            for (const [day, val] of Object.entries(meals)) {
                data[day]["breakfast"] += val.breakfast;
                data[day]["lunch"] += val.lunch;
                data[day]["dinner"] += val.dinner;
            }
        }
        const processed = [
            { day: "monday", breakfast: data.monday.breakfast, lunch: data.monday.lunch, dinner: data.monday.dinner },
            { day: "tuesday", breakfast: data.tuesday.breakfast, lunch: data.tuesday.lunch, dinner: data.tuesday.dinner },
            { day: "wednesday", breakfast: data.wednesday.breakfast, lunch: data.wednesday.lunch, dinner: data.wednesday.dinner },
            { day: "thursday", breakfast: data.thursday.breakfast, lunch: data.thursday.lunch, dinner: data.thursday.dinner },
            { day: "friday", breakfast: data.friday.breakfast, lunch: data.friday.lunch, dinner: data.friday.dinner },
            { day: "saturday", breakfast: data.saturday.breakfast, lunch: data.saturday.lunch, dinner: data.saturday.dinner },
            { day: "sunday", breakfast: data.sunday.breakfast, lunch: data.sunday.lunch, dinner: data.sunday.dinner }
        ]
        res.send(processed);
    }
);

module.exports = router;