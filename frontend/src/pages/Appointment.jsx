import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import {toast} from 'react-toastify'
import { assets } from '../assets/assets';
import RelatedDoctor from '../components/RelatedDoctor';
import axios from 'axios';

const Appointment = () => {

  const {docId} = useParams();
  const {doctors,currencySymbol,backendUrl,token,getDotorData} = useContext(AppContext);
  const Daysofweek = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const navigate = useNavigate();

  const[docInfo , setdocInfo] = useState(null);
  const[docSlots , setdocSlots] = useState([]);
  const[slotIndex , setslotIndex] = useState(0);
  const[slotTime , setslotTime] = useState('');

  const fetchdocinfo = async ()=>{

    const docInfo = doctors.find(doc => doc._id === docId)
    setdocInfo(docInfo);
    console.log(docInfo);

  }

  const getAvailableSlots = async()=>{
     
    setdocSlots([])

    //getting current date 
    let today = new Date()

    for(let i = 0 ; i<7 ; i++)
    {
      let currentdate = new Date(today);
      currentdate.setDate(today.getDate()+i);

      //settign end time of date 
      let endtime = new Date()
      endtime.setDate(today.getDate()+i)
      endtime.setHours(21,0,0,0)

      //setting hours 
      if(today.getDate() === currentdate.getDate())
      {
        currentdate.setHours(currentdate.getHours() > 10 ? currentdate.getHours()+1 : 10)
        currentdate.setMinutes(currentdate.getMinutes() > 30 ? 30:0)
      }
      else
      {
        currentdate.setHours(10)
        currentdate.setMinutes(10)
      }

      let timeSlots = []

      while( currentdate < endtime)
      {
        let formattedTime = currentdate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})

        let day = currentdate.getDate()
        let month = currentdate.getMonth()+1;
        let year = currentdate.getFullYear();

        const slotDate = day+"_"+month+"_"+year ;
        const slotTime = formattedTime;

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false:true ;

        if(isSlotAvailable)
        {
          // add slot to array 
          timeSlots.push({
          datetime:new Date(currentdate),
          time:formattedTime
        })
        }
        
        currentdate.setMinutes(currentdate.getMinutes()+30)
      }

      setdocSlots(prev => ([...prev , timeSlots]))
    }
  }

 const BookAppointment = async()=>{

  if(!token)
  {
    toast.warn('Login to book Appointment');
    return navigate('/login');
  }

  try
  {
      const date = docSlots[slotIndex][0].datetime ;

      let day = date.getDate();
      let month = date.getMonth()+1 ;
      let year = date.getFullYear();

      const slotDate = day +"_"+month+"_"+year ;

      //console.log(slotDate);

      const {data} = await axios.post(backendUrl + "/api/user/book-appointment",{docId ,slotDate ,slotTime},{headers:{token}});

      if(data.success)
      {
        toast.success(data.message);
        getDotorData();
        navigate('/my-appointments')
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
    fetchdocinfo()
  },[doctors,docId])

  useEffect(()=>{
    getAvailableSlots();
  },[docInfo])

  useEffect(()=>{
    console.log(docSlots)
  },[docSlots])

  return docInfo &&(

    <div>
      <div className="flex flex-col sm:flex-row gap-4">

        <div className="">
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name}
            <img src={assets.verify_icon3} alt="" />
          </p>

          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p> {docInfo.degree} - {docInfo.speciality} </p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience }</button>
          </div>

          <div className="">
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3 '> About <img src={assets.info_icon} alt="" /></p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1 '>{docInfo.about}</p>
          </div>

          <p className='text-gray-500 font-medium mt-4'> Appointment fee : <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span> </p>
            
        </div>

      </div>

      {/* booking slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">

          <p> Booking slots</p>

          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {
              docSlots.length && docSlots.map((item ,index ) => (

              <div onClick={()=>setslotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200' }`}>

                  <p>{item[0] && Daysofweek[item[0].datetime.getDay()]}</p>
                    <p>{item[0] && item[0].datetime.getDate()}</p>

              </div>


              ))
            }
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4 ">
            {
              docSlots.length && docSlots[slotIndex].map((item , index) =>(
                <p onClick={()=>setslotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}> 
                {
                  item.time.toLowerCase()
                }
                </p>
              ))
            }
          </div>

          <button onClick={BookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>

        </div>

         <RelatedDoctor docId={docId} speciality={docInfo.speciality}/>

    </div>

  )
}

export default Appointment