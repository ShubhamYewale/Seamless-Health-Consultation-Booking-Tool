import React, { useEffect } from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { dToken, dashdata, setdashdata, getDashData, completeAppointment, cancleAppointment } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext)

  useEffect(() => {

    if (dToken) {
      getDashData();
    }

  }, [dToken])

  return dashdata && (
    <div className='m-5'>

      <div className="flex flex-wrap gap-3">

        <div className="flex items-center gap-2 bg-[#FFFFFF] p-4 min-w-52 rounded border-2 border-[#B4B4B4] cursor-pointer hover:scale-105 transition-all">

          <img className='w-14' src={assets.earning_icon} alt="" />
          <div className="">
            <p className='text-xl font-semobold text-[#4B5563]'>{currency}{dashdata.earnings}</p>
            <p>Earnings</p>
          </div>

        </div>

        <div className="flex items-center gap-2 bg-[#FFFFFF] p-4 min-w-52 rounded border-2 border-[#B4B4B4] cursor-pointer hover:scale-105 transition-all">

          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div className="">
            <p className='text-xl font-semobold text-[#4B5563]'>{dashdata.appointments}</p>
            <p>Appointments</p>
          </div>

        </div>

        <div className="flex items-center gap-2 bg-[#FFFFFF] p-4 min-w-52 rounded border-2 border-[#B4B4B4] cursor-pointer hover:scale-105 transition-all">

          <img className='w-14' src={assets.patients_icon} alt="" />
          <div className="">
            <p className='text-xl font-semobold text-[#4B5563]'>{dashdata.Patients}</p>
            <p>Patients</p>
          </div>

        </div>

      </div>

      <div className="bg-[#FFFFFF]">

        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Booking</p>
        </div>

        <div className="pt-4 border border-t-0">

          {
            dashdata?.latestappointments?.map((item, index) => (

              <div className='flex items-center px-6 py-3 gap-3 hover:bg-[#f3f4f6]' key={index}>

                <img className='rounded-full w-10' src={item.userData.image} alt="" />
                <div className="flex-1 text-sm">
                  <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
                </div>

                {
                  item.cancelled
                    ?
                    <p className='text-[#f87171] text-xs font-medium'>Cancelled</p>
                    : item.isCompleted
                      ?
                      <p className='text-[#22c55e] text-xs font-medium'>Completed</p>
                      : <div className="flex">
                        <img onClick={() => cancleAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                        <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                      </div>
                }

              </div>

            ))
          }

        </div>

      </div>

    </div>
  )
}

export default DoctorDashboard