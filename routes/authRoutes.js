const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const prisma = require('../prisma/client');
const sendEmail = require('../utils/emailSender');
const authMiddleware = require('../middleware/authMiddleware');
const { getVerificationEmailTemplate, getPasswordResetEmailTemplate } = require('../utils/emailTemplates');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.time("Register-Total");

    try {
        console.time("Register-FindUser");
        const existingUser = await prisma.user.findUnique({ where: { email } });
        console.timeEnd("Register-FindUser");
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        console.time("Register-Bcrypt");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.timeEnd("Register-Bcrypt");

        const verificationToken = crypto.randomBytes(32).toString('hex');

        console.time("Register-CreateUser");
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                verificationToken
            },
        });
        console.timeEnd("Register-CreateUser");

        // Send Verification Email (Non-blocking)
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const verificationLink = `${clientUrl}/verify-email/${verificationToken}`;
        const logoPath = path.join(__dirname, '../client/public/logo.png');

        console.time("Register-EmailSetup"); // Measure setup time only
        sendEmail(
            email,
            'Verify your Email - Note Genius',
            getVerificationEmailTemplate(verificationLink, name),
            [{
                filename: 'logo.png',
                path: logoPath,
                cid: 'logo'
            }]
        ).catch(err => console.error("Background Email Error:", err));
        console.timeEnd("Register-EmailSetup");

        console.timeEnd("Register-Total");
        res.status(201).json({ message: 'User created. Please check your email to verify account.' });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Verify Email
router.post('/verify-email', async (req, res) => {
    const { token } = req.body;
    try {
        if (!token) {
            console.log("Verify Email: Token is missing in request body");
            return res.status(400).json({ error: 'Token is missing' });
        }

        const user = await prisma.user.findFirst({ where: { verificationToken: token } });

        if (!user) {
            console.log(`Verify Email: Invalid or expired token received: ${token}`);
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        console.log(`Verify Email: Successfully verified user: ${user.email}`);

        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null }
        });

        res.json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: 'Error verifying email' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.time("Login-Total");

    try {
        console.time("Login-FindUser");
        const user = await prisma.user.findUnique({ where: { email } });
        console.timeEnd("Login-FindUser");

        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        if (!user.isVerified) {
            return res.status(400).json({ error: 'Please verify your email first' });
        }

        console.time("Login-Bcrypt");
        const isMatch = await bcrypt.compare(password, user.password);
        console.timeEnd("Login-Bcrypt");

        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

        console.time("Login-JWT");
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.timeEnd("Login-JWT");

        console.timeEnd("Login-Total");
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires
            }
        });

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetLink = `${clientUrl}/reset-password/${resetToken}`;
        const logoPath = path.join(__dirname, '../client/public/logo.png');

        await sendEmail(
            email,
            'Reset Password - Note Genius',
            getPasswordResetEmailTemplate(resetLink, user.name),
            [{
                filename: 'logo.png',
                path: logoPath,
                cid: 'logo'
            }]
        );

        res.json({ message: 'Password reset link sent to email' });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: 'Error processing request' });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: 'Error resetting password' });
    }
});

// Delete Account
router.delete('/delete-account', authMiddleware, async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.user.id } });
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error("Delete Account Error:", error);
        res.status(500).json({ error: 'Error deleting account' });
    }
});

module.exports = router;
