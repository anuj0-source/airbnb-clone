const User = require("../models/user.model");

async function changeToTravelling(req, res, next) {
    try {
        if (req.session.isLoggedIn) {
            const userId = req.session.userId;

            if (req.session.userType != 'guest') {
                await User.findByIdAndUpdate(userId, { userType: "guest" });
                req.session.userType = "guest";
            }
            res.locals.userType = "guest";
        }

        req.session.save(() => {
            next();
        });

    }
    catch (err) {
        return err;
    }
}

module.exports = changeToTravelling;