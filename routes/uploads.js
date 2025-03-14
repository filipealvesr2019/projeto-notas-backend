const express = require('express');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const router = express.Router();

// upload arquivos com autenticação
router.post('/upload', uploadMiddleware, upload.single('arquivo'), (req, res) => {
    if(!req.file){
        return res.status(400).json({ error: 'Nenhum arquivo enviado!'})
    }

    res.status(200).json({
        message: "Arquivo enviado com sucesso!",
        file: req.file
    })
});

module.exports = router;