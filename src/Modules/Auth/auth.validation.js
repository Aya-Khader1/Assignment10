import joi from 'joi'
import { Types } from 'mongoose';
import { GenderEnum, ProviderEnum, RoleEnum } from "../../Utils/enums/user.enum.js";

export const signupSchema ={
    body:joi.object({
    username : joi.string().min(2).max(25).required(),
    email:joi.string().email({
        minDomainSegments:2,
        maxDomainSegments:5,  
        tlds:{allow:['com','net','org']}
    })
    .required(),
    password :joi.string().alphanum().required(),
    confirmPassword : joi.ref("password"),
    phone : joi.string().pattern(/^(\+20|020|0)?1[0125][0-9]{8}$/).messages({
        "string.patterns.base" : "Invalid Phone Number Format"
    }),
    /*id : joi.string().custom((value,helper)=>{
        return Types.ObjectId.isValid(value) || helper.message('Invalid objectId Format')
    }),*/
    gender : joi.string().valid(...Object.values(GenderEnum)),
    role : joi.string().valid(...Object.values(RoleEnum)),
    provider : joi.string().valid(...Object.values(ProviderEnum)),
    DOB :joi.string().isoDate(),
    confirmEmail :joi.string().isoDate(),
    profilePic : joi.string(),
    coverPictures:joi.array().items(joi.string())
    }),
}

export const loginSchema = {
    body : joi.object({
        email:joi.string().email({
        minDomainSegments:2,
        maxDomainSegments:5,
        tlds:{allow:['com','net','org']}
    })
    .required(),
    password :joi.string().alphanum().required(),
    rememberMe: joi.boolean().optional()

    })
}