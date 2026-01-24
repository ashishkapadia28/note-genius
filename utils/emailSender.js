const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
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
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = sendEmail;
