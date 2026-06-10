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
export const SALT_ROUND = process.env.SALT_ROUND ||10