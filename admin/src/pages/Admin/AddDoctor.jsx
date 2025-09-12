import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import {toast} from 'react-toastify'
import {AdminContext} from '../../context/AdminContext'
import axios from 'axios'

const AddDoctor = () => {

  const[docimg , setdocimg] = useState(false);
  const[name , setname] = useState('');
  const[email , setemail] = useState('');
  const[password , setpassword] = useState('');
  const[Experience , setExperience] = useState('1 Year');
  const[fees , setfees] = useState('');
  const[speciality , setspeciality] = useState('General Physician');
  const[degree , setdegree] = useState('');
  const[address1 , setaddress1] = useState('');
  const[address2 , setaddress2] = useState('');
  const[about , setabout] = useState('');

  const{backendUrl , aToken} = useContext(AdminContext)

  const onsubmitHandler = async(event) =>{
    event.preventDefault();

    try
    {

      if(!docimg)
      {
        return toast.error("image not selected")
      }

      const formdata = new FormData()

      formdata.append('image',docimg)
      formdata.append('name',name)
      formdata.append('email',email)
      formdata.append('password',password)
      formdata.append('experience',Experience)
      formdata.append('fees',Number(fees))
      formdata.append('about',about)
      formdata.append('speciality',speciality)
      formdata.append('degree',degree)
      formdata.append('address',JSON.stringify({line1:address1 , line2:address2}))

      formdata.forEach((value , key)=>{
        console.log(`${key} : ${value}`);
        
      })

      const {data} = await axios.post(backendUrl + '/api/admin/add-doctor',formdata,{headers:{aToken}});

      if(data.success)
      {
        toast.success(data.message);
        setdocimg(false);
        setname('');
        setemail('');
        setpassword('');
        setfees('');
        setdegree('');
        setaddress1('');
        setaddress2('');
        setabout('');
      }
      else{
        toast.error(data.message)
      }

    }
    catch(error)
    {
      toast.error(error.message);
      console.log(error);
    }
  }

  return (
    
    <form onSubmit={onsubmitHandler} className='m-5 w-full'>

      <p className='mb-3 text-lg font-medium'> Add Doctor </p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">

            <div className="flex items-center gap-4 mb-8 text-gray-500">

                <label htmlFor='doc_img'>
                      <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docimg ? URL.createObjectURL(docimg): assets.upload_area} alt="" />
                </label>

                <input onChange={(e)=>setdocimg(e.target.files[0])} type='file' id='doc_img' hidden />
                <p> upload Doctor <br/> Picture</p>
            </div>

            <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

              <div className='w-full lg:flex-1 flex flex-col gap-4'>
                  <div className='flex-1 flex flex-col gap-1'>
                    <p> Doctor Name </p>
                    <input onChange={(e)=>setname(e.target.value)} value={name} className='border rounded px-3 py-2' type='text' placeholder='Name' required></input>
                  </div>

                  <div className='flex-1 flex flex-col gap-1'>
                    <p> Doctor Email </p>
                    <input onChange={(e)=>setemail(e.target.value)} value={email} className='border rounded px-3 py-2' type='email' placeholder='Email' required></input>
                  </div>

                  <div className='flex-1 flex flex-col gap-1'>
                    <p> Doctor Password </p>
                    <input onChange={(e)=>setpassword(e.target.value)} value={password} className='border rounded px-3 py-2' type='password' placeholder='password' required></input>
                  </div>

                  <div className='flex-1 flex flex-col gap-1'>
                    <p> Experience </p>

                    <select onChange={(e)=>setExperience(e.target.value)} value={Experience} className='border rounded px-3 py-2' name='' id=''>
                      <option value="1 year">1 Year</option>
                      <option value="2 year">2 Year</option>
                      <option value="3 year">3 Year</option>
                      <option value="4 year">4 Year</option>
                      <option value="5 year">5 Year</option>
                      <option value="6 year">6 Year</option>
                      <option value="7 year">7 Year</option>
                      <option value="8 year">8 Year</option>
                      <option value="9 year">9 Year</option>
                      <option value="10 year">10 Year</option>
                    </select>
                  </div>

                  <div className='flex-1 flex flex-col gap-1'>
                    <p>Fees</p>
                    <input onChange={(e)=>setfees(e.target.value)} value={fees} className='border rounded px-3 py-2' type='number' placeholder='fees' required></input>
                  </div>
              </div>

              <div className="w-full lg:flex-1 flex flex-col gap-4">

                <div className='flex-1 flex flex-col gap-1'>
                  <p> speciality </p>
                  <select onChange={(e)=>setspeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2' name='' id=''> 

                    <option value="General Physician">General Physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatricians">Pediatricians</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                  </select>
                </div>

                <div className='flex-1 flex flex-col gap-1'>
                    <p>Education</p>
                    <input onChange={(e)=>setdegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type='text' placeholder='Education' required></input>
                </div>

                <div className='flex-1 flex flex-col gap-1'>
                    <p>Address</p>
                    <input onChange={(e)=>setaddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type='text' placeholder='address 1' required></input>
                    <input onChange={(e)=>setaddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type='text' placeholder='address 2' required></input>
                </div>

              </div>


            </div>

            <div>
              <p className='mt-4 mb-2'> About Doctor </p>
              <textarea onChange={(e)=>setabout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='write About doctor' rows={5} required></textarea>
            </div>

            <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'> Add Doctor </button>

      </div>

    </form>
  )
}

export default AddDoctor