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
    const alowedTypes = /jpeg|jpg|png|pdf/;
    const memeType = alowedTypes.test(file.memeType);
    const extname = alowedTypes.test(path.extname(file.originalname));

    if(memeType && extname){
        return cb(null, true);
    }

    cb(new Error('Tipo de arquivo não permitido!'));

}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024} // limite 2mb
})

module.exports = upload;