import jwt from 'jsonwebtoken';
import { successResponse } from '../../Utils/response/success.response.js';
import { findById } from '../../DB/database.repository.js';
import UserModel from '../../DB/Models/user.model.js';
import { NotFoundException } from '../../Utils/response/error.response.js';
import { decrypt } from '../../Utils/security/encryption.security.js';

export const getProfile = async(req,res)=>{
    const {user} = req;
    if(user.phone) user.phone= decrypt(user.phone)
    successResponse({res,statusCode:200,data:{user}})
}