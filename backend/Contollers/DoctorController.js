import doctorModel from '../Model/Doctor.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import AppointmentModel from '../Model/Appointment.js';

const changeAvailability = async(req , res) =>{

    try
    {
            const {docId} = req.body;
            const docData = await doctorModel.findById(docId);
            await doctorModel.findByIdAndUpdate(docId , {available:!docData.available});
            res.json({success:true , message:"availability changed"});


    }
    catch(err)
    {
        console.log(err);
        res.json({success:false , message:err.message});
    }
}

const doctorList = async(req,res)=>{

  try
  {
      const doctors = await doctorModel.find({}).select(['-password','-email']);
      res.json({success:true,doctors});
  }
  catch(err)
  {
    console.log(err);
    res.json({success:false , message:err.message})
  }

}

// Api for doctor login 

const DoctorLogin=async(req,res)=>{

  try
  {
      const{email , password} = req.body;
      const doctor = await doctorModel.findOne({email});

      if(!doctor)
      {
        return res.json({success:false , message:"Invalid credentials"});
      }

      const isMatch = await bcrypt.compare(password , doctor.password);

      if(isMatch)
      {
        const token = jwt.sign({id:doctor._id} , process.env.JWT_SECRET);
        res.json({success:true , token})
      }
      else
      {
        res.json({success:false , message:"Invalid credentials"});
      }
  }
  catch(err)
  {
    console.log(err);
    res.json({success:false , message:err.message})
  }
  
}

// Api to get appointments of specific doctor

const DoctorAppointments = async(req,res)=>{

  try
  {
      const {docId} = req.body ;

      const appointments = await AppointmentModel.find({docId});

      res.json({success:true , appointments})


  }
  catch(err)
  {
    console.log(err);
    res.json({success:false , message:err.message});
  }
}
// api to mark appointment as completed for doctor panel
const AppointmentComplete = async(req , res)=>{

  try
  {
      const{docId , appointmentId} = req.body;

      const appointmentdata = await AppointmentModel.findById(appointmentId);

      if(appointmentdata && appointmentdata.docId === docId)
      {
        await AppointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true});
        return res.json({success:true , message:"appointment completed"});
      }
      else
      {
        return res.json({success:false , message:"mark failed"});
      }
  }
  catch(err)
  {
    console.log(err);
    res.json({success:false , message:err.message});
  }
}


// api to cancle appointment for doctor panel
const AppointmentCancle = async(req , res)=>{

  try
  {
      const{docId , appointmentId} = req.body;

      const appointmentdata = await AppointmentModel.findById(appointmentId);

      if(appointmentdata && appointmentdata.docId === docId)
      {
        await AppointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
        return res.json({success:true , message:"appointment cancelled"});
      }
      else
      {
        return res.json({success:false , message:"cancellation failed"});
      }
  }
  catch(err)
  {
    console.log(err);
    res.json({success:false , message:err.message});
  }
}

//dashboard data for doctor panel
const DashboardData = async(req,res)=>{

  try 
  {
    const{docId} = req.body;
    const appointments = await AppointmentModel.find({docId});

    let earnings = 0;

    appointments.map((item)=>{
      if(item.isCompleted || item.payment)
      {
          earnings += item.amount;
      }

    })

    let patients = [];

    appointments.map((item)=>{
      if(!patients.includes(item.userId))
      {
          patients.push(item.userId);
      }

    })

    const Dashdata = {
      earnings,
      appointments:appointments.length,
      Patients:patients.length,
      latestappointments:appointments.reverse().slice(0,5)
    }
    
    res.json({success:true , Dashdata});
  } 
  catch (err) 
  {
    console.log(err);
    res.json({success:false , message:err.message});
  }
}

// api to get doctor profile for doctor panel 

const DoctorProfile = async(req,res)=>{

  try 
  {
    const{docId} = req.body;

    const profileData = await doctorModel.findById(docId).select("-password");
    res.json({success:true , profileData});

  } catch (err) 
  {
    console.log(err);
    res.json({success:false , message:err.message});
  }
}

// Api to update doctor profile data for doctor panel 

const updateDoctorProfile = async(req ,res)=>{

  try 
  {
    const{docId , fees , address , available} = req.body;
    await doctorModel.findByIdAndUpdate(docId,{fees , address , available});

    res.json({success:true , message:"profile updated"});

  } catch (err) 
  {
    console.log(err);
    res.json({success:false , message:err.message});
  }
}

export { changeAvailability , 
  doctorList , DoctorLogin , 
  DoctorAppointments , AppointmentComplete , 
  AppointmentCancle , DashboardData , DoctorProfile , updateDoctorProfile
}