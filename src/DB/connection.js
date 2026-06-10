import mongoose from 'mongoose';
import { DB_URI } from '../../config/config.service.js';

const connectDB= async()=>{
    try{
        await mongoose.connect(DB_URI,{
            serverSelectionTimeoutMS:5000
        });
        console.log('MongoDB Connectd Successfully')
    }catch(error){
        console.log('MongoDB Connection Faild',error)
    }
}
export default connectDB;