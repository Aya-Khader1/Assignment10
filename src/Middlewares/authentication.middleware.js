import { findById } from "../DB/database.repository.js";
import UserModel from "../DB/Models/user.model.js";
import { SignatureEnum, TokenTypeEnum } from "../Utils/enums/user.enum.js";
import { ForbiddenException, NotFoundException } from "../Utils/response/error.response.js";
import { getSignature, verifyToken } from "../Utils/tokens/token.js";

export const decodedToken = async({authorization, tokenType=TokenTypeEnum.Access})=>{

    const [Bearer,token] = authorization.split(" ") || [];
    let signature = await getSignature({
        signatureLevel : 
        Bearer === "ADMIN" 
        ? SignatureEnum.Admin 
        : Bearer ==='USER' 
        ? SignatureEnum.User
        : new Error('Invalid Signature'),
    });
    const decoded = verifyToken({token,secretKey: tokenType === TokenTypeEnum.Access?signature.accessSignature
        :signature.refreshSignature
    });


    const user = await findById({model:UserModel,id:decoded.id});
    if(!user) throw NotFoundException('User Not Found')
    return {user,decoded}
}

export const authentication = ({tokenType = TokenTypeEnum.Access})=>{
    return async(req,res,next) =>{
        const {user,decoded} = await decodedToken({
            authorization : req.headers.authorization,
            tokenType
        });
        req.user = user;
        req.decoded =decoded;
        return next();
    }
}

export const  authorization= ({accessRoles=[]})=>{
    return async(req,res,next) =>{
        if(!accessRoles.includes(req.user.role))
            throw ForbiddenException("Unauthorized Access")
        return next()
        }
}