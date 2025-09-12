import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {

  const{dToken , profileData , setprofileData ,getProfiledata, backendUrl} = useContext(DoctorContext);
  const{currency } = useContext(AppContext);

  const[isEdit , setisEdit] = useState(false);

  const updateProfile = async()=>{

    try 
    {
      const updateData = {

        address:profileData.address,
        fees:profileData.fees,
        available:profileData.available

      }

      const {data} = await axios.post(backendUrl+'/api/doctor/update-profile',updateData,{headers:{dToken}});

      if(data.success)
      {
        toast.success(data.message);
        setisEdit(false);
        getProfiledata();
      }
      else
      {
        toast.error(data.message);
      }
    } 
    catch (error) 
    {
      toast.error(error.message);
      console.log(error);
      
    }
  }

  useEffect(()=>{
      if(dToken)
      {
        getProfiledata();
      }
  },[dToken]);

  //console.log(profileData);
  

  return profileData && (
    <div>
      
      <div className="flex flex-col gap-4 m-5">

        <div className="">
          <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
        </div>

        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">

          {/* doctor info  */}
          <p className='flex items-center gap-2 text-3xl font-medium text-[#374151]'>{profileData.name}</p>
          <div className="flex items-center gap-2 mt-1 text-[#4B5563]">
             <p>{profileData.degree} - {profileData.speciality}</p>
             <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience
                  }</button>
          </div>

          {/* doc about */}
          <div className="">
                <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
                <p className='text-sm text-[#4B5563] max-w-[700px] mt-1'>{profileData.about}</p>
          </div>

          <p className='text-[#4B5563] font-medium mt-4'>
            Appointment Fee: <span className='text-[#1F2937]'>{currency}{isEdit ? <input type='number' onChange={(e)=>setprofileData(prev =>({...prev ,fees:e.target.value}))} value={profileData.fees}/> : profileData.fees } </span>
          </p>

          <div className="flex gap-2 py-2">
            <p>Address:</p>
            <p className='text-sm'>
              {isEdit ? <input type='text' onChange={(e)=>setprofileData(prev =>({...prev ,address:{...prev.address,line1:e.target.value}}))} value={profileData.address.line1}/> : profileData.address.line1} 
              <br></br>
              {isEdit ? <input type='text' onChange={(e)=>setprofileData(prev =>({...prev ,address:{...prev.address,line2:e.target.value}}))} value={profileData.address.line2}/> : profileData.address.line2} 
              
            </p>
          </div>

          <div className="flex gap-1 pt-2">
            <input onChange={()=> isEdit && setprofileData(prev =>({...prev , available:!prev.available}))} checked={profileData.available} type='checkbox' name='' id=''/>
            <label htmlFor=''>Available</label>
          </div>

          {
            isEdit
            ?
            <button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-[#FFFFFF] transition-all'> Save info </button>
            :
            <button onClick={()=>setisEdit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-[#FFFFFF] transition-all'> Edit </button>

          }

          
        </div>
      </div>

    </div>
  )
}

export default DoctorProfile