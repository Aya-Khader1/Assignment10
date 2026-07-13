import multer from 'multer';
import path from 'node:path'
import fs from 'node:fs'
import { fileTypeFromFile } from "file-type";
import { BadRequestException } from '../response/error.response.js';

export const fileValidation={
    images : ['image/png','image/jpg','image/gif','image/jpeg'],
    videos : ['video/mp4','video/mpeg','video/webm'],
    audios : [   "audio/mpeg","audio/wav", "audio/ogg",],
    documents : ['application/pdf']
}

export const localFileUpload = ({customPath="general",validation=[]})=>{
    const basePath = `uploads/${customPath}`

    const storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            let userBasePath = basePath; //uploads/${customPath}
            if(req.user?._id) userBasePath += `/${req.user._id}` //uploads/${customPath}/_id
            const fullPath = path.resolve(`./src/${userBasePath}`);

            if(!fs.existsSync(fullPath)) fs.mkdirSync(fullPath,{recursive:true});
            
            cb(null,path.resolve(fullPath))
        },
        filename: (req,file,cb) =>{
            const uniqueFilename = 
            Date.now()+ "-" + Math.round(Math.random()*1e9) +
            "-" +
            file.originalname;

            file.finalPath = `${basePath}/${req.user._id}/${uniqueFilename}`
            cb(null,uniqueFilename);

        }
    });

    const fileFilter = (req,file,cb)=>{
        if(validation.includes(file.mimetype)){
            cb(null,true)
        }else{
            return cb(new Error("Invalid File Type"),false)
        }
    }
    return multer({fileFilter ,storage});




}

const ALLOWED_MIMES = Object.values(fileValidation).flat();

export const magicNumberValidation = async(req,res,next) =>{

    const files = req.files || (req.file ? [req.file] : []);

    if (!files.length) return next();

    for (const file of files) {
        const detected = await fileTypeFromFile(file.path);
        if (!detected || !ALLOWED_MIMES.includes(detected.mime)) {

            fs.unlink(file.path, (err) => {
            if (err) console.log(err);
            });
            return BadRequestException({
                message:'Invalid file detected (magic number mismatch)'
            })
        }
        console.log(detected);
        file.detectedMime = detected.mime;
    }
    return next();   
}