const nodemailer = require('nodemailer');
const axios = require('axios');

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

// Verify connection configuration (Commented out for Render as it blocks SMTP)
// transporter.verify(function (error, success) {
//     if (error) {
//         console.error("SMTP Connection Error at Startup:");
//         console.error(error);
//     } else {
//         console.log("SMTP Server is ready to take our messages");
//     }
// });

const sendEmail = async (to, subject, html, attachments = []) => {
    console.log('[DEBUG] sendEmail called');
    console.log('[DEBUG] BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);

    // Priority 1: Use Brevo API (Works on Render Free Tier)
    if (process.env.BREVO_API_KEY) {
        try {
            console.log('Sending email via Brevo API...');
            const senderName = process.env.SENDER_NAME || 'Note Genius';
            const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_EMAIL;

            console.log(`[DEBUG] Sender: ${senderName} <${senderEmail}>`);

            const emailPayload = {
                sender: {
                    name: senderName,
                    email: senderEmail
                },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html
            };

            const formattedAttachments = attachments.map(att => ({
                content: att.content ? att.content.toString('base64') : '',
                name: att.filename
            })).filter(a => a.content);

            if (formattedAttachments.length > 0) {
                emailPayload.attachment = formattedAttachments;
            }

            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                emailPayload,
                {
                    headers: {
                        'api-key': process.env.BREVO_API_KEY,
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    }
                }
            );
            console.log('Brevo API Response:', response.data);
            return true;
        } catch (error) {
            console.error('Brevo API Error:', error.response ? JSON.stringify(error.response.data) : error.message);
            console.error('[DEBUG] Full error:', error);
            // Don't fallback to SMTP automatically if API key is present but failed,
            // as SMTP is known to fail on Render anyway.
            return false;
        }
    }

    // Priority 2: Use Nodemailer (Works Locally / Paid Render)
    console.log('[DEBUG] Falling back to Nodemailer SMTP');
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SENDER_NAME || 'Note Genius'}" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html,
            attachments,
        });
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('FAILED to send email (SMTP) to:', to);
        console.error('Error details:', error.message);
        if (error.response) console.error('SMTP Response:', error.response);
        return false;
    }
};

module.exports = sendEmail;
