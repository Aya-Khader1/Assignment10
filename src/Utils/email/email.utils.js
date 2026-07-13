import nodemailer from 'nodemailer'
import { USER_PASS, USER_EMAIL } from '../../../config/config.service.js'


export async function sendEmail({to,text, html,subject,
            cc,
            bcc,
            attachments}){
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:USER_EMAIL,
            pass:USER_PASS
        }
    });

    try{
        const info = await transporter.sendMail({
            from:`"Aya" <${USER_EMAIL}>`,
            to,
            subject,
            text,
            html,
            cc,
            bcc,
            attachments
        })
        console.log(`Email Sent ${info.messageId}`)
    }catch(err){
        console.log(`Error Sent :${err}`)

    }
}

export const emailSubject = {
    confirmEmail : "Confirm Your Email",
    resetPassword : "Reset Your Password",
    resendEmail : "Resend Verification Code",
    welcome : "Welcome",
    contactUs :"Contact Us"
}
