import express from 'express'
import cors from 'cors'  // for connection

import 'dotenv/config'

// database 
import main from './Config/mongodb.js'

// cloudinary
import connectCloudinary from './Config/cloudinary.js'
import AdminRouter from './Routes/AdminRoute.js'
import DoctorRouter from './Routes/DoctorRoute.js'
import UserRouter from './Routes/UserRoute.js'
import chatRoutes from "./Routes/chatRoutes.js";

// app config 
const app = express() ;
const port = process.env.PORT || 4000 ;

main()                 // call this functions 
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints

app.use('/api/admin',AdminRouter);

app.use('/api/doctor',DoctorRouter);

app.use('/api/user',UserRouter);

app.use("/api", chatRoutes);

app.get('/',(req,res)=>{
    res.send('App is working');
})

app.listen(port , ()=>{
    console.log("app is listening on port",port);
})