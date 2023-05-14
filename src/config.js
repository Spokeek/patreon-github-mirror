const logger = require('./logger')
const convict = require('convict');
const path = require('path');

const config = convict({
    application: {
        port: {
            doc: 'The application port to bind.',
            format: 'port',
            default: 3000,
        },
    },
    data: {
        documentPath: {
            doc: 'The path to the document folder.',
        }
    },
    patreon: {
        secret: {
            doc: 'The patreon api secret.',
            sensitive: true,
        }
    }
});

// Load environment dependent configuration
var environment = process.env.NODE_ENV || 'development';
const confFilePath = path.resolve(__dirname, '../config', `${environment}.json`);
logger.info(`loading config for environment "${environment}" at "${confFilePath}"`);

config.validate({ allowed: 'strict' });
try {
    config.loadFile(confFilePath);
}
catch (error) {
    logger.warn("cannot load config file");
    logger.warn(error);
}
module.exports = config;