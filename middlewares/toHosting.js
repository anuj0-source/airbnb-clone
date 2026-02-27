const User = require("../models/user.model");

async function changeToHost(req, res, next) {
    try {
        const userId = req.session.userId;
        if (req.session.userType != 'host') {
            await User.findByIdAndUpdate(userId, { userType: "host" });

            req.session.userType = 'host';

        }
        res.locals.userType = 'host';
        req.session.save(() => next());

    }
    catch (err) {
        console.log(err);
        return err;
    }
}

module.exports = changeToHost;