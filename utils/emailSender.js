const nodemailer = require('nodemailer');

// Debugging: Check if env vars are loaded (showing only first 2 chars)
const emailUser = process.env.SMTP_EMAIL || '';
const emailPass = process.env.SMTP_PASSWORD || '';
console.log(`SMTP Debug: User=${emailUser.substring(0, 2)}***, Pass=${emailPass ? 'set' : 'not set'}, Length=${emailPass.length}`);

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error("SMTP Connection Error at Startup:");
        console.error(error);
    } else {
        console.log("SMTP Server is ready to take our messages");
    }
});

const sendEmail = async (to, subject, html, attachments = []) => {
    try {
        const info = await transporter.sendMail({
            from: `"Note Genius" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html,
            attachments,
        });
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('FAILED to send email to:', to);
        console.error('Error details:', error.message);
        if (error.response) console.error('SMTP Response:', error.response);
        return false;
    }
};

module.exports = sendEmail;
