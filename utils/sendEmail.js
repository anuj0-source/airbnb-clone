const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML body content
 */
async function sendEmail(to, subject, html) {
    const mailOptions = {
        from: `"Airbnb" <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
