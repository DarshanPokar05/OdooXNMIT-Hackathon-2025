const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/imageController');
const auth = require('../middleware/auth');

// Upload single image
router.post('/upload', auth, upload.single('image'), uploadImage);

module.exports = router;