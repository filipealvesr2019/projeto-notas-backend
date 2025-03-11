const multer = require("multer");
const path = require("path");

// configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // pasta aonde os arquivos serao salvos
    },
    filename: (req, file, cb) => {
        cb(null, `${Data.now()}-${file.originalname}`);
    }
});

// Filtra pra os tipos de arquivos permitidos
const fileFilter = (req, file, cb) => {
    const alowedTypes = /jpeg|jpg|png|pdf/
}