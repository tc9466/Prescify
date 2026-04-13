import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { backendUrl, token, userData, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [image, setImage] = useState(false);

  useEffect(() => {
    if (userData) {
      setEditData(userData);
    }
  }, [userData]);

  const updateProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", editData.name || "");
      formData.append("phone", editData.phone || "");
      formData.append("dob", editData.dob || "");
      formData.append("gender", editData.gender || "");
      formData.append(
        "address",
        JSON.stringify({
          line1: editData.address?.line1 || "",
          line2: editData.address?.line2 || "",
        })
      );

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (!editData) return <p>Loading...</p>;

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <div className="relative w-36 h-36">
        {isEdit ? (
          <label htmlFor="image" className="cursor-pointer block w-full h-full">
            <img
              className="w-36 h-36 rounded object-cover"
              src={
                image
                  ? URL.createObjectURL(image)
                  : editData?.image || assets.profile_pic
              }
              alt="Profile"
              onError={(e) => {
                e.target.src = assets.profile_pic;
              }}
            />

            <div className="absolute inset-0 rounded bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
              <img
                src={assets.upload_icon}
                alt="Upload"
                className="w-7"
              />
            </div>

            <input
              type="file"
              id="image"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        ) : (
          <img
            className="w-36 h-36 rounded object-cover"
            src={editData?.image || assets.profile_pic}
            alt="Profile"
            onError={(e) => {
              e.target.src = assets.profile_pic;
            }}
          />
        )}
      </div>

      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4 border px-2 py-1"
          type="text"
          value={editData.name || ""}
          onChange={(e) =>
            setEditData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {editData.name}
        </p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>

        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{editData.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-50 max-w-52 border px-2 py-1"
              type="text"
              value={editData.phone || ""}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-blue-500">{editData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p>
              <input
                className="bg-gray-50 border px-2 py-1"
                type="text"
                value={editData.address?.line1 || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <br />
              <input
                className="bg-gray-50 border px-2 py-1 mt-2"
                type="text"
                value={editData.address?.line2 || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {editData.address?.line1}
              <br />
              {editData.address?.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>

        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-28 bg-gray-100 border px-2 py-1"
              value={editData.gender || ""}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, gender: e.target.value }))
              }
            >
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          ) : (
            <p className="text-gray-500">{editData.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="max-w-36 bg-gray-100 border px-2 py-1"
              type="date"
              value={editData.dob ? editData.dob.slice(0, 10) : ""}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, dob: e.target.value }))
              }
            />
          ) : (
            <p className="text-gray-500">
              {editData.dob ? editData.dob.slice(0, 10) : ""}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={updateProfile}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Save information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;