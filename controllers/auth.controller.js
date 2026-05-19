const { body, validationResult, check } = require("express-validator");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res) => {
    res.render("./store/login-page", { check: false, notexist: false, wrongPass: false });
};

exports.postLogin = async (req, res) => {

    try {
        const { email, password } = req.body;

        const logUser = await User.findOne({ email });

        if (!logUser) {
            return res.status(422).render("./store/login-page", { check: true, notexist: true, wrongPass: false, oldValues: { email } });
        }

        const savedPassword = logUser.password;

        const isCorrect = await bcrypt.compare(password, savedPassword);

        if (!isCorrect) {
            return res.render("./store/login-page", { check: true, notexist: false, wrongPass: true, oldValues: { email } });
        }

        req.session.isLoggedIn = true;
        req.session.userId = String(logUser._id);
        req.session.userType = logUser.userType;
        req.session.profilePic = logUser.profilePic || null;
        req.session.toast = { msg: 'Logged in successfully ✅', type: 'success' };

        req.session.save(() => {
            if (req.session.userType == 'host') return res.redirect('/host/listings');

            else return res.redirect('/');
        })

    }
    catch (err) {
        console.log("Error wile logging", err);
        res.redirect("/login", { check: false });
    }
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getSignUp = (req, res) => {
    res.render("./store/signup-page", { validationFail: false, errorMsg: [], fieldErrors: {}, isExist: false });
};

exports.postSignUp = [
    body("firstName")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("First name should be atleast 2 characters long!")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("First name should be contain only characters"),

    body("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password should be minimum of 8 length")
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).+$/)
        .withMessage("Password must contain uppercase & special character"),

    body("confirmPassword")
        .custom((value, { req }) => {
            if (value != req.body.password) {
                throw new Error("Password do not match");
            }

            return true;

        }),

    body("userType")
        .notEmpty()
        .withMessage("Please select user type")
        .isIn(['guest', 'host'])
        .withMessage("Please select a valid user type"),

    async (req, res) => {
        try {
            const { firstName, lastName, email, password, confirmPassword, userType } = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // Build a field-to-error map for inline messages
                const fieldErrors = {};

                errors.array().forEach(e => {
                    if (e.path && !fieldErrors[e.path]) {
                        fieldErrors[e.path] = e.msg;
                    }
                });

                console.log(fieldErrors)

                return res.status(422).render("./store/signup-page", {
                    validationFail: true,
                    errorMsg: errors.array().map(e => e.msg),
                    fieldErrors,
                    oldValues: {
                        firstName,
                        lastName,
                        email,
                        password,
                        confirmPassword,
                        userType
                    },
                    isExist: false
                });
            }

            const isExist = await User.exists({ email });

            if (isExist) {
                return res.render("./store/signup-page", {
                    validationFail: false, errorMsg: [], fieldErrors: {}, oldValues: {
                        firstName,
                        lastName,
                        email,
                        password,
                        confirmPassword,
                        userType
                    }, isExist: true
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({ firstName, lastName, email, password: hashedPassword, userType });

            await user.save()

            req.session.toast = { msg: 'Account created successfully! Please log in ✅', type: 'success' };
            res.redirect("/login");

        }
        catch (err) {
            console.log("Error while signup", err);
            res.redirect("/signup");
        }
    }
];