const multer = require("multer");
const path = require("path");

// configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // pasta aonde os arquivos serao salvos
    }
})