const crypto = require("crypto");
const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const sendEmail = require("../utils/sendEmail");

/**
 * Generate a 6-digit numeric OTP
 */
function generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
}

/**
 * Build the branded HTML email body for the OTP
 */
function otpEmailHtml(otp) {
    return `
    <div style="font-family:'Inter',Arial,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;">
        <div style="background:linear-gradient(135deg,#FF385C,#E31C5F);padding:32px 24px;text-align:center;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/512px-Airbnb_Logo_B%C3%A9lo.svg.png" alt="Airbnb" style="height:36px;filter:brightness(0) invert(1);">
        </div>
        <div style="padding:32px 24px;">
            <h2 style="margin:0 0 8px;font-size:22px;color:#222;">Your login code</h2>
            <p style="margin:0 0 24px;font-size:14px;color:#717171;">Enter this code to log in to your Airbnb account. It expires in 5 minutes.</p>
            <div style="background:#F7F7F7;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
                <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#222;">${otp}</span>
            </div>
            <p style="margin:0;font-size:12px;color:#B0B0B0;text-align:center;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
    </div>`;
}

// ─── GET /login-otp ────────────────────────────────────────────────
exports.getLoginOtp = (req, res) => {
    res.render("./store/login-otp", {
        step: "email",         // "email" | "otp"
        email: "",
        errorMsg: null,
        successMsg: null
    });
};

// ─── POST /login-otp/send ──────────────────────────────────────────
exports.postSendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.render("./store/login-otp", {
                step: "email",
                email: "",
                errorMsg: "Please enter your email address.",
                successMsg: null
            });
        }

        const user = await User.findOne({ email: { $regex: new RegExp(`^${email.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });

        if (!user) {
            return res.render("./store/login-otp", {
                step: "email",
                email,
                errorMsg: "No account found with this email. Please sign up first.",
                successMsg: null
            });
        }

        // Delete any existing OTPs for this email
        await Otp.deleteMany({ email: email.trim().toLowerCase() });

        // Generate & save new OTP
        const otpCode = generateOtp();
        await Otp.create({ email: email.trim().toLowerCase(), otp: otpCode });

        // Send email
        await sendEmail(
            email.trim(),
            "Your Airbnb login code",
            otpEmailHtml(otpCode)
        );

        return res.render("./store/login-otp", {
            step: "otp",
            email: email.trim().toLowerCase(),
            errorMsg: null,
            successMsg: `We've sent a 6-digit code to ${email}`
        });

    } catch (err) {
        console.log("Error sending OTP:", err);
        return res.render("./store/login-otp", {
            step: "email",
            email: req.body.email || "",
            errorMsg: `Error: ${err.message || err}`,
            successMsg: null
        });
    }
};

// ─── POST /login-otp/verify ────────────────────────────────────────
exports.postVerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!otp || otp.trim().length !== 6) {
            return res.render("./store/login-otp", {
                step: "otp",
                email,
                errorMsg: "Please enter a valid 6-digit code.",
                successMsg: null
            });
        }

        const otpRecord = await Otp.findOne({
            email: email.trim().toLowerCase(),
            otp: otp.trim()
        });

        if (!otpRecord) {
            return res.render("./store/login-otp", {
                step: "otp",
                email,
                errorMsg: "Invalid or expired code. Please try again.",
                successMsg: null
            });
        }

        // OTP valid — find user and create session
        const user = await User.findOne({ email: { $regex: new RegExp(`^${email.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });

        if (!user) {
            return res.render("./store/login-otp", {
                step: "email",
                email,
                errorMsg: "Account not found. Please sign up first.",
                successMsg: null
            });
        }

        // Clean up used OTP
        await Otp.deleteMany({ email: email.trim().toLowerCase() });

        // Set session (same as regular login)
        req.session.isLoggedIn = true;
        req.session.userId = String(user._id);
        req.session.userType = user.userType;
        req.session.profilePic = user.profilePic || null;
        req.session.toast = { msg: 'Logged in successfully ✅', type: 'success' };

        req.session.save(() => {
            if (req.session.userType === 'host') return res.redirect('/host/listings');
            return res.redirect('/');
        });

    } catch (err) {
        console.log("Error verifying OTP:", err);
        return res.render("./store/login-otp", {
            step: "otp",
            email: req.body.email || "",
            errorMsg: `Error: ${err.message || err}`,
            successMsg: null
        });
    }
};

// ─── POST /login-otp/resend ────────────────────────────────────────
exports.postResendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Delete existing OTPs
        await Otp.deleteMany({ email: email.trim().toLowerCase() });

        // Generate & save new OTP
        const otpCode = generateOtp();
        await Otp.create({ email: email.trim().toLowerCase(), otp: otpCode });

        // Send email
        await sendEmail(
            email.trim(),
            "Your Airbnb login code",
            otpEmailHtml(otpCode)
        );

        return res.render("./store/login-otp", {
            step: "otp",
            email: email.trim().toLowerCase(),
            errorMsg: null,
            successMsg: "A new code has been sent to your email."
        });

    } catch (err) {
        console.log("Error resending OTP:", err);
        return res.render("./store/login-otp", {
            step: "otp",
            email: req.body.email || "",
            errorMsg: `Error: ${err.message || err}`,
            successMsg: null
        });
    }
};
