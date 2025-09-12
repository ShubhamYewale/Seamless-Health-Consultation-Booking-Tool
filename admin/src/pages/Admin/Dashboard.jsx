import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {

  const { aToken, Dashdata, getDashdata, cancleAppointment } = useContext(AdminContext);

  console.log(Dashdata.latestAppointments);

  const{slotDateFormat}=useContext(AppContext);

  useEffect(() => {

    if (aToken) {
      getDashdata();
    }
  }, [aToken])

  

  return Dashdata && (

    <div className='m-5'>

      <div className="flex flex-wrap gap-3">

        <div className="flex items-center gap-2 bg-[#FFFFFF] p-4 min-w-52 rounded border-2 border-[#B4B4B4] cursor-pointer hover:scale-105 transition-all">
          
          <img className='w-14' src={assets.doctor_icon2} alt="" />
          <div className="">   
            <p className='text-xl font-semobold text-[#4B5563]'>{Dashdata.doctors}</p>
            <p>Doctors</p>
          </div>

        </div>

        <div className="flex items-center gap-2 bg-[#FFFFFF] p-4 min-w-52 rounded border-2 border-[#B4B4B4] cursor-pointer hover:scale-105 transition-all">

          <img className='w-14' src={assets.appointments_icon4} alt="" />
          <div className="">
            <p className='text-xl font-semobold text-[#4B5563]'>{Dashdata.appointments}</p>
            <p>Appointments</p>
          </div>

        </div>

        <div className="flex items-center gap-2 bg-[#FFFFFF] p-4 min-w-52 rounded border-2 border-[#B4B4B4] cursor-pointer hover:scale-105 transition-all">

          <img className='w-14' src={assets.patient_icon2} alt="" />
          <div className="">
            <p className='text-xl font-semobold text-[#4B5563]'>{Dashdata.patients}</p>
            <p>Patients</p>
          </div>

        </div>

      </div>

      <div className="bg-[#FFFFFF]">

        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon2} alt="" />
          <p className='font-semibold'>Latest Booking</p>
        </div>

        <div className="pt-4 border border-t-0">
 
          {
           Dashdata?.latestAppointments?.map((item, index) => (

                <div className='flex items-center px-6 py-3 gap-3 hover:bg-[#f3f4f6]' key={index}>

                  <img className='rounded-full w-10' src={item.docData.image} alt="" />
                  <div className="flex-1 text-sm">
                    <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                    <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
                  </div>

                  {
                                item.cancelled
                                ?
                                <p className='text-[#FF474C] text-xs font-medium'>cancelled</p>
                                : item.isCompleted
                                 ?
                                 <p className='text-[#22c55e] text-xs font-medium'> completed</p>
                                 :
                                 <img onClick={()=>cancleAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                              }

                  </div>

              ))
          } 

        </div>

      </div>

    </div>



  )
}

export default Dashboard