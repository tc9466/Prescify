import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    completeAppointment,
    cancelAppointment
  } = useContext(DoctorContext)

  const { currency, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  if (!dashData) {
    return <div className='m-5 text-gray-600'>Loading...</div>
  }

  return (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded border border-gray-100'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {currency}{dashData.earnings}
            </p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded border border-gray-100'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {dashData.appointments}
            </p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded border border-gray-100'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {dashData.patients}
            </p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white mt-10 rounded border'>
        <div className='flex items-center gap-2.5 px-4 py-4 border-b'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div>
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className='flex items-center gap-3 px-6 py-3 hover:bg-gray-50 border-b last:border-b-0'
              >
                <img
                  className='w-10 h-10 rounded-full object-cover'
                  src={item.userData?.image || assets.profile_pic}
                  alt=""
                />

                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>
                    {item.userData?.name || 'N/A'}
                  </p>
                  <p className='text-gray-400'>
                    {item.slotDate ? slotDateFormat(item.slotDate) : 'No Date'}
                  </p>
                </div>

                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <div className='flex items-center gap-2'>
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className='w-8 cursor-pointer'
                      src={assets.cancel_icon}
                      alt=""
                    />
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className='w-8 cursor-pointer'
                      src={assets.tick_icon}
                      alt=""
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className='p-4 text-sm text-gray-500'>No recent bookings</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard