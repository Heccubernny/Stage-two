"use strict";
Object.defineProperty( exports, "__esModule", { value: true } );
exports.ENVIRONMENT = void 0;
exports.ENVIRONMENT = {
    APP: {
        NAME: process.env.APP_NAME || 'Ikubanni Peter',
        PORT: process.env.PORT || '8000',
        ENV: process.env.APP_ENV || 'development',
    },
    DB: {
        HOST: process.env.DB_HOST || 'localhost',
        PORT: parseInt( process.env.DB_PORT || '5432', 10 ),
        USERNAME: process.env.DB_USERNAME || '',
        PASSWORD: process.env.DB_PASSWORD || '',
        NAME: process.env.DB_NAME || '',
    },
    JWT: {
        SECRET: process.env.APP_JWT_SECRET || 'defaultJwtSecret',
    },
};
