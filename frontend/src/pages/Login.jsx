import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate()
 
  const {token , settoken , backendUrl} = useContext(AppContext)

  const[state , setstate] = useState('sign up');

  const[Email , setEmail] = useState('');
  const[pass , setpass] = useState('');
  const[name , setname] = useState('');

  const onSubmitHandler = async(event)=>
  {
        event.preventDefault();

        try
        {
            if(state === 'sign up')
            {
              const {data} = await axios.post(backendUrl + '/api/user/register',{name,Email,pass});
              if(data.success)
              {
                localStorage.setItem('token',data.token);
                settoken(data.token);
              }
              else
              {
                toast.error(data.message);
              }
            }
            else
            {
              const {data} = await axios.post(backendUrl + '/api/user/login',{Email,pass});
              if(data.success)
              {
                localStorage.setItem('token',data.token);
                settoken(data.token);
              }
              else
              {
                toast.error(data.message);
              }
            }
        }
        catch(err)
        {
            toast.error(err.message);
        }
  }

  useEffect(()=>{
    if(token)
    {
      navigate('/')
    }
  },[token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>

      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className='text-2xl font-semibold'>{state === 'sign up' ? 'create account' : 'login'}</p>
        <p>please {state === 'sign up' ? 'sign up' : 'log in'} to book appointment </p>

        {
          state === 'sign up' && <div className="w-full">

          <p>Full Name</p>
          <input className='border border-zinc-300 rounded w-full p-1 mt-1' type='text' onChange={(e)=>setname(e.target.value)} value={name} required />

        </div>
        }
        <div className="w-full">

          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-1 mt-1' type='email' onChange={(e)=>setEmail(e.target.value)} value={Email} required />
       
        </div>

        <div className="w-full">

          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-1 mt-1' type='password' onChange={(e)=>setpass(e.target.value)} value={pass} required />
       
        </div>
        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>{state === 'sign up' ? 'Create Account' : 'login'}</button>
        {
          state === 'sign up'
          ? 
          <p>Already have an account? <span onClick={()=>setstate('login')} className='text-primary underline cursor-pointer'> login here</span></p>
          :<p> create an new account <span onClick={()=>setstate('sign up')}  className='text-primary underline cursor-pointer'>click here </span></p>
        }
      </div>

    </form>
  )
}

export default Login