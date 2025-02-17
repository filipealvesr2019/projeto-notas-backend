const express = require('express');
const {body, validationResult} = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const AuthMiddleware = require('../middleware/AuthMiddleware');
const router = express.Router();

// criar nota
router.post('/', AuthMiddleware, [
    body('titulo').trim().escape(),
    body('conteudo'). customSanitizer(value => sanitizeHtml(value))
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }
})