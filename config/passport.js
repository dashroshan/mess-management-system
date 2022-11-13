const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {

                //get the user data from google 
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value
                }

                try {
                    //find the user in our database or create user if not found 
                    let user = await User.findOne({ googleId: profile.id });
                    if (!user) user = await User.create(newUser);
                    done(null, user);
                } catch (err) {
                    console.error(err);
                }
            }
        )
    )

    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    // used to deserialize the user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}