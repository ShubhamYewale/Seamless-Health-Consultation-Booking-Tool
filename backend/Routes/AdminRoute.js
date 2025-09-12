import express from 'express'
import { AddDoctor , Alldoctors, loginAdmin , AppointmentsAdmin ,AppointmentCancle , AdminDashboard } from '../Contollers/AdminController.js'
import upload from '../Middlewares/multer.js'
import AuthAdmin from '../Middlewares/AuthAdmin.js';
import { changeAvailability } from '../Contollers/DoctorController.js';

const AdminRouter = express.Router();

AdminRouter.post('/add-doctor',AuthAdmin,upload.single('image'),AddDoctor);

AdminRouter.post('/login',loginAdmin);

AdminRouter.post('/all-doctors',AuthAdmin,Alldoctors);

AdminRouter.post('/change-availability',AuthAdmin,changeAvailability);

AdminRouter.get('/appointments',AuthAdmin,AppointmentsAdmin);

AdminRouter.post('/cancle-appointment',AuthAdmin,AppointmentCancle);

AdminRouter.get('/dashboard',AuthAdmin,AdminDashboard);



export default AdminRouter