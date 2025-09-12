import React, { useContext, useState } from 'react'
// import {assets} from '../assets/assets'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {

  const{userdata , setuserdata , backendUrl, LoadUserProfileData,token } = useContext(AppContext);

 const[isedit , setisedit] = useState(false);
 const [image , setimage] = useState(false);

 const updateUserProfileData = async()=>{

  try{
      const formdata = new FormData();

      formdata.append("name",userdata.name);
      formdata.append("phone",userdata.phone);
      formdata.append("address",JSON.stringify(userdata.address));
      formdata.append("gender",userdata.gender);
      formdata.append("dob",userdata.dob);

      image && formdata.append('image',image);

      const {data} = await axios.post(backendUrl + '/api/user/update-profile',formdata,{headers:{token}});

      if(data.success)
      {
        toast.success(data.message);
        await LoadUserProfileData();
          setisedit(false);
          setimage(false);
        
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

  return userdata && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {
        isedit 
        ? 
        <label htmlFor='image'>
          <div className='inline-block relative cursor-pointer'>

            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image):userdata.image} alt="" />
            <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />

          </div>
          <input onChange={(e)=>setimage(e.target.files[0])} type='file' id='image' hidden></input>
        </label>
        :
        <img className='w-36 rounded' src={userdata.image} alt="" />
      }
         
          {
            isedit
            ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type='text' value={userdata.name} onChange={e=> setuserdata(prev =>({...prev , name:e.target.value}) )}></input>
            :<p className='font-medium text-3xl text-neutral-800 mt-4'>{userdata.name}</p>
          }

          <hr className='bg-zinc-400 h-[1px] border-none'/>
          <div>
            <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION </p>

            <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
              <p className='font-medium'>Email Id:</p>
              <p className='text-blue-500'>{userdata.email}</p>
              <p className='font-medium'>phone:</p>
              {
                isedit
                ?
                <input className='bg-gray-100 max-w-52' type='text' value={userdata.phone} onChange={e=>setuserdata(prev =>({...prev , phone:e.target.value}))}></input>
                :<p className='text-blue-400'>{userdata.phone}</p>
              }
              <p className='font-medium'>Address:</p>
              {
                isedit
                ?
                <p>
                 <input className='bg-gray-50' type='text' value={userdata.address.line1} onChange={e=>setuserdata(prev =>({...prev ,address:{...prev.address , line1:e.target.value}}))}></input>
                 <br></br>
                 <input className='bg-gray-50' type='text' value={userdata.address.line2} onChange={e=>setuserdata(prev =>({...prev ,address:{...prev.address , line2:e.target.value}}))}></input>
                </p>
                :
                <p className='text-gray-500'>
                  {userdata.address.line1}
                  <br></br>
                  {userdata.address.line2}
                </p>
              }
            </div>
          </div>

          <div>
            <p className='text-neutral-500 underline mt-3' >BASIC INFORMATION</p>
            <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
              <p className='font-medium'>Gender:</p>
              {
                isedit
                ?
                <select className='max-w-20 bg-gray-100'  onChange={e=>setuserdata(prev =>({ ...prev , gender:e.target.value}))} value={userdata.gender}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                :
                <p className='text-gray-400'>
                  {userdata.gender}
                </p>
              }
              <p className='font-medium'>Date of Birth</p>
              {
                isedit
                ?
                <input className='max-w-28 bg-gray-100' type='date' value={userdata.dob} onChange={e=>setuserdata(prev =>({ ...prev , dob:e.target.value}))} ></input>
                :
                <p className='text-gray-400'>
                  {userdata.dob}
                </p>
              }
            </div>
          </div>

          <div className="mt-10">
            {
              isedit
              ?
              <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={updateUserProfileData}>Save Information</button>
              :
              <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={()=>setisedit(true)}>Edit</button>
            }
          </div>
    </div>
  )
}

export default MyProfile