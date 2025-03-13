const express = require('express');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const router = express.Router();

// upload arquivos com autenticação
router.post('/upload', uploadMiddleware, )