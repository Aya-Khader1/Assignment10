import connectDB from "./DB/connection.js";
import { userRouter,authRouter,messageRouter } from "./Modules/index.js";
import {globalErrorHandler ,NotFoundException } from "./Utils/response/error.response.js";
import { successResponse } from "./Utils/response/success.response.js";
import cors from 'cors';
const bootstrap = async(app,express)=>{
    app.use(express.json(),cors());
    await connectDB()


    app.get('/',(req,res)=>{
        successResponse({res,statusCode:201,message:'Hello '})
    })

    app.use('/api/v1/auth',authRouter);
    app.use('/api/v1/message',messageRouter);
    app.use('/api/v1/user',userRouter);






    app.all('/*dummy',(req,res)=>{
        NotFoundException('Not Found Handler')
    });

    app.use(globalErrorHandler);
}

export default bootstrap;