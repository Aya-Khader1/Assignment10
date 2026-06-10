import { compare, hash } from "bcrypt";
import { SALT_ROUND } from "../../../config/config.service.js"
import {HashEnum} from './../enums/security.enum.js'
import * as argon2 from 'argon2'
import { BadRequestException } from "../response/error.response.js";
export const generateHash = async({
    plaintext,
    saltRounds =SALT_ROUND,
    algorithm =HashEnum.Bcrypt
})=>{
    let hashResults = "";
    switch(algorithm){
        case HashEnum.Bcrypt:
            hashResults =await hash(plaintext,saltRounds);
            break;
        case HashEnum.Argon2:
            hashResults =await argon2.hash(plaintext); 
            break;
            default:
                throw BadRequestException("unspported hashing algorithm")
    }
    return hashResults;
}


export const compareHash = async({
    plaintext,
    ciphertext,
    algorithm =HashEnum.Bcrypt
})=>{
    let match = false;
    switch(algorithm){
        case HashEnum.Bcrypt:
            match =await compare(plaintext,ciphertext);
            break;
        case HashEnum.Argon2:
            match =await argon2.verify(ciphertext,plaintext); 
            break;
            default:
                throw BadRequestException("unspported hashing algorithm")
    }
    return match;
}