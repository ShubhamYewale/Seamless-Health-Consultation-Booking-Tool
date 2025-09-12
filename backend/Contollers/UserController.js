import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'

import userModel from '../Model/User.js';
import doctorModel from '../Model/Doctor.js';
import AppointmentModel from '../Model/Appointment.js';
import razorpay from 'razorpay';


// Api to register the user

const RegisterUser = async(req , res)=>{

    try
    {
        //console.log(req.body);

        const { name , Email , pass } = req.body;

        //console.log(name , Email , pass);

        if(!name || !Email || !pass)
        {
            return res.json({success:false , message:"Missing Details"});
        }
        if(!validator.isEmail(Email))
        {
            return res.json({success:false , message:"Enter a valid email"});
        }
        if(pass.length < 8)
        {
            return res.json({success:false , message:"Enter a strong password"});
        }

        // hashing user password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass , salt);

        const userData = {
            name ,
            email:Email ,
            password:hashedPassword
        }

        const newuser = new userModel(userData);
        const user = await newuser.save();

        const token = jwt.sign({id:user._id} , process.env.JWT_SECRET);

        res.json({success:true , token})
    }
    catch(err)
    {
        console.log(err);
        res.json({success:false , message:err.message});
    }
}

const LoginUser = async(req,res)=>{

    try
    {
        const{Email , pass} = req.body;
        const email = Email;
       // console.log(email , pass);
        const user = await userModel.findOne({email});
        //console.log(user);

        if(!user)
        {
            return res.json({success:false , message:"user does not exist"})
        }

        const isMatch = await bcrypt.compare(pass , user.password);

        if(isMatch)
        {
            const token = jwt.sign({id:user._id} , process.env.JWT_SECRET);
            res.json({success:true ,token});
        }
        else
        {
            res.json({success:false , message:"Invalid Credentials"});
        }
    }
    catch(err)
    {
        console.log(err);
        res.json({success:false , message:err.message});
    }
}

const getProfile = async(req,res)=>{

    try{

        const {userId} = req.body;
        const userData = await userModel.findById(userId).select('-password');

        res.json({success:true , userData});
    }
    catch(err)
    {
        console.log(err);
        res.json({success:false , message:err.message});
    }
    
}

const updateProfile = async(req ,res)=>{

    try
    {
        const{userId , name , phone , address , gender , dob} = req.body;
       

        const imagefile = req.file;

        console.log(req.body);

        if(!name || !phone || !gender || !dob)
        {
            return res.json({success:false , message:"Data missing"})
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender});

        if(imagefile)
        {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imagefile.path,{resource_type:'image'});
            const imageURL = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId,{image:imageURL});
        }

        res.json({success:true , message:"profile updates successfully"});
    }
    catch(err)
    {
        console.log(err);
        res.json({success:false , message:err.message});
    }
    
}

// Api to book appointment
const BookAppointment = async(req , res)=>{

    try
    {
        const {userId , docId , slotDate , slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select('-password');

        if(!docData.available)
        {
            return res.json({success:false , message:"doctor not available "})
        }

        let slots_booked = docData.slots_booked ;

        //checking for slot availability 

        if(slots_booked[slotDate])
        {
            if(slots_booked[slotDate].includes(slotTime))
            {
                return res.json({success:false , message:"slot not available "})
            }
            else
            {
                slots_booked[slotDate].push(slotTime)
            }
        }
        else
        {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select('-password');

        delete docData.slots_booked ; 

        const appointmentData = {
            userId ,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()
        }

        const newAppointment = new AppointmentModel(appointmentData);
        await newAppointment.save();

        // save new slot data in docdata
        await doctorModel.findByIdAndUpdate(docId,{slots_booked});

        res.json({success:true , message:"Appointment Booked"});

    }

    catch(err)
    {
        console.log(err);
        res.json({success:false , message:err.message});
   
    }
}

const ListAppointment = async(req,res)=>{

    try{

        const{userId} = req.body;
        const appointments = await AppointmentModel.find({userId});

        res.json({success:true , appointments});

    }
    catch(error)
    {
        console.log(error);
        res.json({success:false , message:error.message});
    }
}

const cancleAppointment = async(req,res)=>{
    try{

        const{ userId , appointmentId } = req.body

        const appointmentData = await AppointmentModel.findById(appointmentId);

        // verify appointment user
        if(appointmentData.userId !== userId)
        {
            return res.json({success:false , message:"unauthorizes actioin"})
        }

        await AppointmentModel.findByIdAndUpdate(appointmentId , {cancelled:true});

        //releasing doctor slot 

        const{docId , slotDate , slotTime} = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId , {slots_booked});

        res.json({success:true, message:"appointment cancelled"})
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false , message:error.message});
    }

}

// api for payment razorpay

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay  = async(req, res) => {

    try
    {

        const {appointmentId} = req.body;
        const appointmentData = await AppointmentModel.findById(appointmentId);

        if(!appointmentData || appointmentData.cancelled)
        {
            return res.json({success:false , message:"Appointment not found or cancelled"});
        }

        // creating options for razorpay payment
        const options = { 

            amount: appointmentData.amount * 100, // amount in the smallest currency unit
            currency: process.env.CURRENCY || 'INR', // default to INR if not set
            receipt: appointmentId,
        
        }

        // creation of order

        const order = await razorpayInstance.orders.create(options);

        res.json({success:true , order});

    }

    catch(error)
    {
        console.log(error);
        res.json({success:false , message:error.message});
    }
}

// api to verify razorpay payment

const verifyRazorpay = async(req, res) => {

    try
    {
        const {razorpay_order_id} = req.body.response;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);   

        if( orderInfo.status === 'paid' )
        {
            await AppointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment:true});
            res.json({success:true , message:"Payment  successful"});
        }
        else{
            res.json({success:false , message:"Payment failed"});
        }
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false , message:error.message});
    }

}

export {RegisterUser , LoginUser , getProfile , updateProfile , BookAppointment  , ListAppointment,cancleAppointment , paymentRazorpay , verifyRazorpay};