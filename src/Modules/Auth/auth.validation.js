import joi from 'joi'
import { Types } from 'mongoose';
import { generaleFields } from '../../Middlewares/validation.middleware.js';

export const signupSchema ={
    body:joi.object({
    username :generaleFields.username.required(),
    email : generaleFields.email.required(),
    password : generaleFields.password.required(),
    phone:generaleFields.phone,
    confirmPassword: generaleFields.confirmPassword,
    gender : generaleFields.gender,
    role :generaleFields.role,
    provider:generaleFields.provider,
    DOB :generaleFields.DOB,
    confirmEmail :generaleFields.confirmEmail,
    profilePic : generaleFields.profilePic,
    coverPictures:generaleFields.coverPictures
    /*id : joi.string().custom((value,helper)=>{
        return Types.ObjectId.isValid(value) || helper.message('Invalid objectId Format')
    }),*/
    
    }),
}

export const loginSchema = {
    body : joi.object({
    email:generaleFields.email.required(),
    password :generaleFields.password.required(),
    rememberMe: joi.boolean().optional()

    })
}

export const confirmEmailSchema = {
    body : joi.object({
    email:generaleFields.email.required(),
    otp:generaleFields.otp, 
    rememberMe: joi.boolean().optional()

    })
}

export const resendEmailSchema = {
    body : joi.object({
    email:generaleFields.email.required(),
    })
}

export const forgetPasswordSchema = {
    body : joi.object({
    email:generaleFields.email.required(),
    rememberMe: joi.boolean().optional()

    })
}

export const resetPasswordSchema = {
    body : joi.object({
    email:generaleFields.email.required(),
    newPassword:generaleFields.password.required(),
    otp:generaleFields.otp, 
    confirmPassword : joi.ref("newPassword"),
    rememberMe: joi.boolean().optional()

    })
}
