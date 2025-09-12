import express from 'express'
import { AppointmentCancle, AppointmentComplete, DashboardData, DoctorAppointments, doctorList , DoctorLogin ,DoctorProfile , updateDoctorProfile } from '../Contollers/DoctorController.js';
import AuthDoctor from '../Middlewares/AuthDoctor.js';

const DoctorRouter = express.Router();

DoctorRouter.get('/list' , doctorList);

DoctorRouter.post('/login' , DoctorLogin);

DoctorRouter.get('/appointments' , AuthDoctor,DoctorAppointments);
DoctorRouter.post('/complete-appointment' , AuthDoctor,AppointmentComplete);
DoctorRouter.post('/cancle-appointment' , AuthDoctor,AppointmentCancle);
DoctorRouter.get('/dashboard' , AuthDoctor,DashboardData);

DoctorRouter.get('/profile' , AuthDoctor,DoctorProfile);
DoctorRouter.post('/update-profile' , AuthDoctor,updateDoctorProfile);



export default DoctorRouter

