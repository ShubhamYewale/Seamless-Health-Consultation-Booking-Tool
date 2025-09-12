import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import {toast} from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = (props)=>{

    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const[doctors , setdoctors] = useState([]);
    const[token , settoken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false);
    const[userdata , setuserdata] = useState(false);

    const getDotorData = async()=>{

        try
        {
            const {data} = await axios.get(backendUrl + '/api/doctor/list');
            if(data.success)
            {
                setdoctors(data.doctors);
            }
            else
            {
                toast.error(data.message);
            }

        }
        catch(error)
        {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        getDotorData();
    }, [])

    const LoadUserProfileData = async()=>{

        try
        {
            const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}});
            console.log(data); 

            if(data.success)
            {
                setuserdata(data.userData);
            }
            else
            {
                toast.error(data.message);
            }
        }
        catch(err)
        {
            console.log(err);
            toast.error(err.message);
        }

    }

    useEffect(()=>{

        if(token)
        {
            LoadUserProfileData();
        }
        else
        {
            setuserdata(false);
        }

    },[token])

    const value = {
        doctors,getDotorData,currencySymbol,
        token , settoken,
        backendUrl , userdata , setuserdata ,
        LoadUserProfileData
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider