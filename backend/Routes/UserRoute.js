import express from 'express'

import { RegisterUser , LoginUser, getProfile, updateProfile , BookAppointment , ListAppointment, cancleAppointment , paymentRazorpay , verifyRazorpay} from '../Contollers/UserController.js'
import AuthUser from '../Middlewares/AuthUser.js';
import upload from '../Middlewares/multer.js';

const UserRouter = express.Router();

UserRouter.post('/register',RegisterUser);

UserRouter.post('/login',LoginUser);

UserRouter.get('/get-profile',AuthUser,getProfile);

UserRouter.post('/update-profile',upload.single('image'),AuthUser,updateProfile);

UserRouter.post('/book-appointment',AuthUser,BookAppointment);

UserRouter.get('/appointments',AuthUser,ListAppointment);

UserRouter.post('/cancle-appointment',AuthUser,cancleAppointment);

UserRouter.post('/payment-razorpay',AuthUser,paymentRazorpay);

UserRouter.post('/verify-razorpay',AuthUser,verifyRazorpay) ;



export default UserRouter

