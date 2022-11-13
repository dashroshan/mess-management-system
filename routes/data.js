const express = require("express");
const passport = require("passport");
const router = express.Router();

const Menu = require('../models/Menu');
const Time = require('../models/Time');

router.get(
    "/menu",
    async (req, res) => {
        res.send(await Menu.getMenu());
    }
);

router.get(
    "/time",
    async (req, res) => {
        res.send(await Time.getTimes());
    }
);

router.get(
    "/status",
    async (req, res) => {
        res.send({ loggedIn: req.isAuthenticated(), admin: (req.isAuthenticated() && req.user?.email === process.env.ADMIN) });
    }
);

module.exports = router;