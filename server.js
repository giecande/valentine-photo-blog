const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'valentine2024';

// Ensure uploads directory exists with proper error handling
const uploadsDir = path.join(__dirname, 'uploads');
try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('Created uploads directory');
    }
} catch (err) {
    console.error('Error creating uploads directory:', err);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Images only! Accepted formats: JPEG, JPG, PNG, GIF, WEBP'));
        }
    }
});

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Get all photos
app.get('/api/photos', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading photos:', err);
            return res.status(500).json({ error: 'Unable to read photos' });
        }
        
        const photos = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => {
                try {
                    const stats = fs.statSync(path.join(uploadsDir, file));
                    return {
                        filename: file,
                        url: `/uploads/${file}`,
                        date: stats.birthtime
                    };
                } catch (err) {
                    console.error(`Error reading file ${file}:`, err);
                    return null;
                }
            })
            .filter(photo => photo !== null)
            .sort((a, b) => b.date - a.date);
        
        res.json(photos);
    });
});

// Upload photo (admin only)
app.post('/api/upload', (req, res) => {
    const password = req.headers['x-admin-password'];
    
    if (password !== ADMIN_PASSWORD) {
        console.log('Unauthorized upload attempt');
        return res.status(401).json({ error: 'Unauthorized - Invalid admin password' });
    }
    
    upload.array('photos', 10)(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            const errorMessage = err.message || err.toString();
            return res.status(400).json({ error: errorMessage });
        }
        
        if (!req.files || req.files.length === 0) {
            console.log('No files in upload request');
            return res.status(400).json({ error: 'No files uploaded' });
        }
        
        console.log(`Successfully uploaded ${req.files.length} file(s)`);
        
        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            url: `/uploads/${file.filename}`,
            date: new Date()
        }));
        
        res.json({ success: true, files: uploadedFiles });
    });
});

// Delete photo (admin only)
app.delete('/api/photos/:filename', (req, res) => {
    const password = req.headers['x-admin-password'];
    
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);
    
    fs.unlink(filepath, (err) => {
        if (err) {
            console.error('Error deleting photo:', err);
            return res.status(500).json({ error: 'Unable to delete photo' });
        }
        console.log(`Deleted photo: ${filename}`);
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin password: ${ADMIN_PASSWORD}`);
});
