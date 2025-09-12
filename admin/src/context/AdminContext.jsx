import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext();

const AdminContextProvider = (props) =>{

    const[aToken , setaToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '' );
    const[doctors , setdoctors] = useState([]);
    const[appointments , setappointments] = useState([]);
    const[Dashdata , setDashdata] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAlldoctors = async() =>{

        try{
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors',{},{headers:{aToken}});

            if(data.success)
            {
                setdoctors(data.doctors);
                console.log(data.doctors);
                
            }
            else
            {
                toast.error(data.message)
            }
        }
        catch(err)
        {
            toast.err(err.message);
        }

    }

    const changeAvailability = async(docId) =>{

        try
        {
            const {data} = await axios.post(backendUrl + '/api/admin/change-availability',{docId},{headers:{aToken}});

            if( data.success)
            {
                toast.success(data.message);
                getAlldoctors()
            }
            else{
                toast.error(data.message);
            }
        }
        catch(err)
        {
            toast.error(err.message);
        }
    }

    const getAllAppointments = async()=>{

        try
        {
            const {data} = await axios.get(backendUrl+"/api/admin/appointments",{headers:{aToken}});
           // console.log(data);
            
            if(data.success)
            {
                setappointments(data.appointments)
            }
            else
            {
                toast.error(data.message);
            }
        }
        catch(err)
        {
            toast.error(err.message);
        }
    }

    const cancleAppointment = async(appointmentId)=>
    {
            try{
               // console.log(" we are in cancle appoint",appointmentId);
                
                const {data} = await axios.post(backendUrl+"/api/admin/cancle-appointment",{appointmentId},{headers:{aToken}});

                if(data.success)
                {
                    toast.success(data.message);
                    getAllAppointments()
                }
                else
                {
                    toast.error(data.message);
                }
            }
            catch(err)
            {
                toast.error(err.message);
            }
    }

    const getDashdata = async()=>{

        try
        {
          const {data} = await axios.get(backendUrl+'/api/admin/dashboard',{headers:{aToken}});

          if(data.success)
          {
            setDashdata(data.DashData);
            console.log(data.DashData);
          }
          else
          {
            toast.error(data.message);
          }
        }
        catch(err)
        {
            toast.error(err.message);
        }
    }

    const value = {
        aToken, setaToken,
        backendUrl,doctors,
        getAlldoctors , changeAvailability,
        appointments , setappointments ,
        getAllAppointments , cancleAppointment,
        Dashdata , getDashdata
    }

    return(
        <AdminContext.Provider value={value}>
                {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider