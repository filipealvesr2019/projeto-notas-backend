const ratelimit = require('express-rate-limit');

// limite de 100 requesiçoes por ip a cada 15 minutos

const rateLimitMiddleware = ratelimit({
    window: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: {error: "Muitas requisições, tente novamente mais tarde."}

});

module.exports = rateLimitMiddleware