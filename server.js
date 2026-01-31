const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, './client/dist')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Base API route check
app.get('/api/status', (req, res) => {
    res.send('NoteGenius API is running');
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res, next) => {
    // Standard SPA fallback: serve index.html for any GET request
    // that hasn't matched an API route
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        const indexPath = path.join(__dirname, './client/dist/index.html');
        // DEBUG: Log path verification
        console.log(`[SPA Fallback] Request: ${req.path}`);
        console.log(`[SPA Fallback] Serving: ${indexPath}`);

        // Simple file existence check (optional, but good for debugging)
        const fs = require('fs');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            console.error(`[SPA Fallback] Error: File not found at ${indexPath}`);
            res.status(500).send(`Server Error: Frontend build not found on server. Path searched: ${indexPath}`);
        }
    } else {
        // Otherwise it's a 404 for APIs/assets/POSTs
        res.status(404).json({ error: 'Not Found' });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
