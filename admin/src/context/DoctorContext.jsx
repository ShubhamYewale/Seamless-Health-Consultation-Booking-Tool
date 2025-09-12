import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify'


export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setdToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
    const [appointments, setappointments] = useState([]);
    const [dashdata, setdashdata] = useState(false);

    const[profileData , setprofileData] = useState();

    const getAppointments = async () => {

        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } });

            if (data.success) {
                setappointments(data.appointments);
                console.log(data.appointments);

            }
            else {
                toast.error(data.message);
            }
        }
        catch (err) {
            console.log(err)
            toast.error(err.message);
        }
    }

    const completeAppointment = async (appointmentId) => {

        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(err)
            toast.error(err.message);
        }
    }

    const cancleAppointment = async (appointmentId) => {

        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancle-appointment', { appointmentId }, { headers: { dToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(err)
            toast.error(err.message);
        }
    }

    const getDashData = async () => {

        try {
            const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", { headers: { dToken } });

            if (data.success) {
               setdashdata(data.Dashdata);
               console.log(data.Dashdata);
               
            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(err)
            toast.error(err.message);
        }
    }


    const getProfiledata = async()=>{

        try 
        {
            const{data} = await axios.get(backendUrl+'/api/doctor/profile',{headers:{dToken}});
            console.log(data);
            if(data.success)
            {
                setprofileData(data.profileData);
                console.log(data.profileData);
                

            }
        } catch (err) 
        {
            console.log(err)
            toast.error(err.message);
        }
    }

    const value = {

        dToken, setdToken, backendUrl
        , appointments, setappointments, getAppointments,
        completeAppointment, cancleAppointment,
        dashdata , setdashdata , getDashData,
        profileData , setprofileData ,getProfiledata

    }



    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider