import { SALT_ROUND } from "../../../config/config.service.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";
import { compareHash, generateHash } from "../../Utils/security/hash.security.js";
import { create, findOne } from "./../../DB/database.repository.js";
import UserModel from './../../DB/Models/user.model.js'
import {BadRequestException, ConfelictException, NotFoundException} from './../../Utils/response/error.response.js'
import {successResponse} from './../../Utils/response/success.response.js'


export const signup =async(req,res)=>{

        const {username,email,password} = req.body;

        if(await findOne({model:UserModel,filter:{email}}))
            throw ConfelictException('User already exists');

        const hashPassword = await generateHash({
            plaintext:password,
            saltRounds : Number(SALT_ROUND),
            algorithm : HashEnum.Bcrypt
        })

        const user = await create({
            model:UserModel,
            data:[{username,email,password:hashPassword}]
        })
    
     successResponse(
       { res,
        statusCode:201,
        data:{user},
        message:'User created '})

}

export const login = async(req,res) =>{

    const {email,password} = req.body;

    const user = await findOne({model:UserModel,filter:{email}})

    if(!user) throw NotFoundException('User not found');
    const isMatched = await compareHash({
        plaintext : password,
        ciphertext : user.password,
        algorithm : HashEnum.Bcrypt
    })
    if(!isMatched) throw BadRequestException('Invalid credentials')

     successResponse(
       { res,
        statusCode:200,
        data:{user},
        message:'User logged'})
}