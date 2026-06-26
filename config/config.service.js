import dotenv from 'dotenv';
import {resolve} from 'node:path'


export const NODE_ENV = process.env.NODE_ENV || 'development';

const envPath= {
    development : 'dev.env',
    stagn:'stagn.env',
    production  : 'prod.env'
}

dotenv.config({path:resolve(`./config/${envPath.development}`)})

export const PORT = process.env.PORT || 5000;
export const DB_URI = process.env.DB_URI
export const SALT_ROUND = process.env.SALT_ROUND ||10;

export const ENC_KEY = process.env.ENC_KEY;

//Tokens
export const ACCESS_TOKEN_USER_SECRET = process.env.ACCESS_TOKEN_USER_SECRET;
export const ACCESS_TOKEN_USER_EXPIRES_IN = process.env.ACCESS_TOKEN_USER_EXPIRES_IN;
export const REFRESH_TOKEN_USER_EXPIRES_IN = process.env.REFRESH_TOKEN_USER_EXPIRES_IN;
export const REFRESH_TOKEN_USER_SECRET = process.env.REFRESH_TOKEN_USER_SECRET;

export const ACCESS_TOKEN_ADMIN_SECRET = process.env.ACCESS_TOKEN_ADMIN_SECRET;
export const REFRESH_TOKEN_ADMIN_SECRET = process.env.REFRESH_TOKEN_ADMIN_SECRET;
export const ACCESS_TOKEN_ADMIN_EXPIRES_IN = process.env.ACCESS_TOKEN_ADMIN_EXPIRES_IN;
export const REFRESH_TOKEN_ADMIN_EXPIRES_IN = process.env.REFRESH_TOKEN_ADMIN_EXPIRES_IN;

export const CLIENT_ID = process.env.CLIENT_ID;