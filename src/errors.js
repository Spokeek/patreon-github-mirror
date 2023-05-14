const logger = require('./logger')

function expressErrorHandler(err, req, res, next) {
    if (err instanceof HTTPError) {
        logger.error(err)
        res.status(err.statusCode).send(err.message)
    } else {
        next()
    }
}

class HTTPError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.name = "HTTPError";
        this.statusCode = status;
    }
}

module.exports = {
    expressErrorHandler,
    HTTPError
};