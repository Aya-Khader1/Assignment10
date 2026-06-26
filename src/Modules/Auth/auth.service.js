import { CLIENT_ID, SALT_ROUND} from "../../../config/config.service.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";
import { decrypt, encrypt } from "../../Utils/security/encryption.security.js";
import { compareHash, generateHash } from "../../Utils/security/hash.security.js";
import { generateToken, getNewLoginCredentials } from "../../Utils/tokens/token.js";
import { create, findOne } from "./../../DB/database.repository.js";
import UserModel from './../../DB/Models/user.model.js'
import {BadRequestException, ConfelictException, NotFoundException} from './../../Utils/response/error.response.js'
import {successResponse} from './../../Utils/response/success.response.js'
import { OAuth2Client } from "google-auth-library";



export const signup =async(req,res)=>{
        const {username,email,password,phone} = req.body;
        

        if(await findOne({model:UserModel,filter:{email}}))
            throw ConfelictException('User already exists');

        const hashPassword = await generateHash({
            plaintext:password,
            saltRounds : Number(SALT_ROUND),
            algorithm : HashEnum.Bcrypt
        })
        const encryptedPhone = encrypt(phone)

        const user = await create({
            model:UserModel,
            data:[{username,email,password:hashPassword,phone:encryptedPhone}]
        })
     successResponse(
       { res,
        statusCode:201,
        data:{user},
        message:'User created '})

}

export const login = async(req,res) =>{

    const {email,password,rememberMe = false} = req.body;
    const user = await findOne({model:UserModel,filter:{email}})

    if(!user) throw NotFoundException('User not found');
    const isMatched = await compareHash({
        plaintext : password,
        ciphertext : user.password,
        algorithm : HashEnum.Bcrypt
    })
    if(!isMatched) throw BadRequestException('Invalid credentials');
    if(user.phone) user.phone = decrypt(user.phone) 
   
    const tokens = await getNewLoginCredentials(user,{rememberMe});

     successResponse(
       {res,
        statusCode:200,
        data:{tokens},
        message:'User logged'})
}

export const refreshToken = async(req,res)=>{
    
    const tokens = await getNewLoginCredentials(req.user,{},"REFRESH");
    
    successResponse({res,statusCode:200,data:{tokens},message:"Done"})
}

async function verifyGoogleAccount({idToken}){
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken,
            audience: CLIENT_ID, 
        })
        const payload = ticket.getPayload();
        return payload;
}

export const loginWithGoogle =async(req,res)=>{
    const {idToken} = req.body;
    const {email,email_verified,given_name,family_name,picture}=
    await verifyGoogleAccount({idToken});
    if(!email_verified) throw BadRequestException('Email Not Verified');

    const user = await findOne({
        model :UserModel,
        filter:{email}
    });

    if(user){
        if(user.provider === ProviderEnum.GOOGLE){
            const credentials = await getNewLoginCredentials(user);
            return successResponse({
                res,
                message:'Login Successfully',
                data:{credentials},
                statusCode:200
            });
        }
    }
    const newUser = await create({
        model:UserModel,
        data:[
            {
                firstName : given_name,
                lastName :family_name,
                email,
                profilePic:picture,
                provider:ProviderEnum.GOOGLE
            }
        ]
    })
    const credentials = await getNewLoginCredentials(newUser);
            return successResponse({
                res,
                message:'Login Successfully',
                data:{credentials},
                statusCode:201
            });
}