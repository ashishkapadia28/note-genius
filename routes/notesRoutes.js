const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../prisma/client');
const { parsePDF } = require('../utils/pdfParser');
const authMiddleware = require('../middleware/authMiddleware');
const redis = require('../utils/redisClient');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Analyze
router.post('/analyze', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const { text } = req.body;
        let studyMaterial = text;

        if (req.file) {
            if (req.file.mimetype === 'application/pdf') {
                studyMaterial = await parsePDF(req.file.buffer);
            } else {
                return res.status(400).json({ error: 'Only PDF files are supported' });
            }
        }

        if (!studyMaterial) {
            return res.status(400).json({ error: 'Please provide text or upload a PDF' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are an educational assistant.

From the given study material, provide:

1. Simple explanation in very easy language
2. Short notes in bullet points
3. 5 important 5-mark questions
4. 3 important 10-mark questions

Study Material:
${studyMaterial}`;

        const result = await model.generateContent(prompt);
        const aiOutput = result.response.text();

        const note = await prisma.note.create({
            data: {
                userId: req.user.id,
                originalText: studyMaterial,
                aiOutput: aiOutput,
            },
        });

        // Invalidate cache
        await redis.del(`notes_history:${req.user.id}`);

        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating notes' });
    }
});

// History
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const cacheKey = `notes_history:${req.user.id}`;
        const cachedNotes = await redis.get(cacheKey);

        if (cachedNotes) {
            console.log('Serving from cache');
            return res.json(JSON.parse(cachedNotes));
        }

        const notes = await prisma.note.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });

        await redis.set(cacheKey, JSON.stringify(notes), 'EX', 3600); // Cache for 1 hour

        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching history' });
    }
});

module.exports = router;
