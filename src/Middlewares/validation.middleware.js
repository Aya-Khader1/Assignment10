import { BadRequestException } from "../Utils/response/error.response.js";
import joi from 'joi';
import { GenderEnum, ProviderEnum, RoleEnum } from "../Utils/enums/user.enum.js";


export const generaleFields = {
    username : joi.string().min(2).max(25),
    email:joi.string().email({
            minDomainSegments:2,
            maxDomainSegments:5,  
            tlds:{allow:['com','net','org']}
        }),
    password :joi.string(),
    confirmPassword : joi.ref("password"),
    phone : joi.string().pattern(/^(\+20|020|0)?1[0125][0-9]{8}$/).messages({
        "string.patterns.base" : "Invalid Phone Number Format"
    }),
    gender : joi.string().valid(...Object.values(GenderEnum)),
    role : joi.string().valid(...Object.values(RoleEnum)),
    provider : joi.string().valid(...Object.values(ProviderEnum)),
    DOB :joi.string().isoDate(),
    confirmEmail :joi.string().isoDate(),
    profilePic : joi.string(),
    coverPictures:joi.array().items(joi.string()),
    otp:joi.string().pattern(/^\d{6}$/),
    oldPassword:joi.string(),
    
}


export const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];

        for (const key of Object.keys(schema)) {

            const validationResults = schema[key].validate(req[key], {
                abortEarly: false
            });

            if (validationResults.error) {
                validationErrors.push({
                    key,
                    details: validationResults.error.details
                });
            }
        }

        if (validationErrors.length) {
            throw BadRequestException("ValidationError", validationErrors);
        }

        return next();
    };
};