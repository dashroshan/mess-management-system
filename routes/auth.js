const express = require("express");
const passport = require("passport");
const router = express.Router();

// To be used as the login button link
router.get(
    "/signin",
    passport.authenticate(
        "google",
        {
            prompt: "select_account",
            scope: ["profile", "email"]
        }
    )
);

// Send get request to logout
router.get(
    "/signout",
    (req, res) => {
        req.logout();
        res.redirect(process.env.FRONTEND);
    }
);

// For google redirection handling
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: process.env.FRONTEND }),
    (req, res) => {
        res.redirect(process.env.FRONTEND);
    }
);

module.exports = router;