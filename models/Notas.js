const { default: mongoose } = require("mongoose");

const NotasSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    conteudo: { type: String, required: true}
});

module.exports =  mongoose.model('Notas', NotasSchema)