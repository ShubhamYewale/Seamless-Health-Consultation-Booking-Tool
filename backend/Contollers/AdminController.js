import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../Model/Doctor.js'
import jwt from 'jsonwebtoken'
import AppointmentModel from "../Model/Appointment.js"
import userModel from "../Model/User.js"

const AddDoctor = async(req , res) =>{

    try{
        const {name , email , password , speciality , degree , experience , about , fees , address} = req.body;
        const imagefile = req.file;

        console.log(req.body ," .... " , req.file );

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address)
        {
            return res.json({success:false , message:"Missing Details"})
        }

        // validating email format 
        if(!validator.isEmail(email))
        {
            return res.json({success:false , message:"plz enter a valid email "})
        }

        // validating strong password 
        if(password.length < 8)
        {
            return res.json({success:false , message:"plz enter a strong password "})
        }

        // hashing doctor password 

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)

        // upload image to cloudinary
        const imageupload = await cloudinary.uploader.upload(imagefile.path , {resoure_type:"image"});
        const imageurl = imageupload.secure_url;


        const doctorData = {
            name,
            email,
            image:imageurl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about , 
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({success:true , message:"Doctor Added"})
        
    }
    catch(err)
    {
        console.log("error in admin controller")
        console.log(err);
        res.json({success:false , message:err.message})
        
    }
}

// Api for admin login 

const loginAdmin = async(req , res )=>{

    try{

        const {email , password} = req.body;

        if( email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD)
        {
            const token = jwt.sign(email+password , process.env.JWT_SECRET);
            res.json({success:true , token})
        }
        else
        {
            res.json({success:false , message:"Invalid credentials "})
        }
    }
    catch(err)
    {
        console.log(err);
        res.json({success:false , message:err.message})
        
    }
}
// api call to get all doctors from database 
const Alldoctors = async(req , res) =>{

    try{

        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true , doctors})
    }
    catch(err)
    {
        console.log(err);
        res.json({success:false , message:err.message})
    }
}

// Api to get all appointment list 
const AppointmentsAdmin = async(req,res)=>{

    try
    {
        const appointments = await AppointmentModel.find({});
        res.json({success:true , appointments});

    }
    catch(err)
    {
        console.log(err);
        res.json({success:false , message:err.message});
    }
}

// Api to cancle appointment with admin

const AppointmentCancle = async(req,res)=>{
    try{

        const{appointmentId } = req.body;

        const appointmentData = await AppointmentModel.findById(appointmentId);
        //console.log(appointmentData);
        

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

// api to get all data to show on dashboard panel

const AdminDashboard = async(req,res)=>{

    try
    {
       const doctors = await doctorModel.find({});
       const users = await userModel.find({});
       const Appointments = await AppointmentModel.find({});


       const DashData = {

        doctors:doctors.length,
        patients:users.length,
        appointments:Appointments.length,
        latestAppointments:Appointments.reverse().slice(0,5)
       }

       res.json({success:true , DashData});

    }
    catch(error)
    {
        console.log(error);
        res.json({success:false , message:error.message});
    }
}

export {AddDoctor , loginAdmin , Alldoctors , AppointmentsAdmin , AppointmentCancle , AdminDashboard}