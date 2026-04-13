import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const {
    dToken,
    profileData,
    setProfileData,
    getProfileData,
    backendUrl
  } = useContext(DoctorContext)

  const { currency, getDoctorsData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  const updateProfile = async () => {
    try {
      const updateData = {
        fees: profileData.fees,
        address: profileData.address,
        available: profileData.available
      }

      const { data } = await axios.post(
        backendUrl + '/api/doctor/update-profile',
        updateData,
        {
          headers: {
            dtoken: dToken
          }
        }
      )

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        await getProfileData()
        await getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  if (!profileData) {
    return <div className='m-5 text-gray-600'>Loading...</div>
  }

  return (
    <div className='m-5'>
      <div>
        <img
          className='bg-primary/80 w-full sm:max-w-64 rounded-lg'
          src={profileData.image || profileData.Image}
          alt={profileData.name}
        />
      </div>

      <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white mt-4'>
        <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
          {profileData.name}
        </p>

        <div className='flex items-center gap-2 mt-1 text-gray-600'>
          <p>
            {profileData.degree} - {profileData.speciality}
          </p>
          <button
            type='button'
            className='py-0.5 px-2 border text-xs rounded-full'
          >
            {profileData.experience}
          </button>
        </div>

        <div className='mt-6'>
          <p className='flex items-center gap-1 text-sm font-medium text-neutral-800'>
            About:
          </p>
          <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
            {profileData.about}
          </p>
        </div>

        <p className='text-gray-600 font-medium mt-4'>
          Appointment fee:{' '}
          <span className='text-gray-800'>
            {currency}
            {isEdit ? (
              <input
                type='number'
                className='border rounded px-2 py-1 w-24 ml-2'
                value={profileData.fees}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    fees: e.target.value
                  }))
                }
              />
            ) : (
              profileData.fees
            )}
          </span>
        </p>

        <div className='flex gap-2 py-2'>
          <p className='font-medium'>Address:</p>
          <div className='text-sm'>
            {isEdit ? (
              <div className='flex flex-col gap-2'>
                <input
                  type='text'
                  className='border rounded px-3 py-1'
                  value={profileData.address?.line1 || ''}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line1: e.target.value
                      }
                    }))
                  }
                />

                <input
                  type='text'
                  className='border rounded px-3 py-1'
                  value={profileData.address?.line2 || ''}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line2: e.target.value
                      }
                    }))
                  }
                />
              </div>
            ) : (
              <p className='text-gray-600'>
                {profileData.address?.line1}
                <br />
                {profileData.address?.line2}
              </p>
            )}
          </div>
        </div>

        <div className='flex gap-2 pt-2 items-center'>
          <input
            type='checkbox'
            checked={profileData.available}
            onChange={() =>
              isEdit &&
              setProfileData((prev) => ({
                ...prev,
                available: !prev.available
              }))
            }
          />
          <label>Available</label>
        </div>

        {isEdit ? (
          <button
            type='button'
            onClick={updateProfile}
            className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
          >
            Save
          </button>
        ) : (
          <button
            type='button'
            onClick={() => setIsEdit(true)}
            className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default DoctorProfile