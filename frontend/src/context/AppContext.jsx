import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(false);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/get-profile",
        {
          headers: { token }
        }
      );

      if (data.success) {
        setUserData(data.userData);
      } else {
        if (
          data.message === "jwt expired" ||
          data.message === "Invalid token" ||
          data.message === "Not Authorized, login again"
        ) {
          localStorage.removeItem("token");
          setToken("");
          setUserData(false);
          return;
        }

        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      if (
        error?.response?.data?.message === "jwt expired" ||
        error?.response?.data?.message === "Invalid token" ||
        error?.response?.data?.message === "Not Authorized, login again"
      ) {
        localStorage.removeItem("token");
        setToken("");
        setUserData(false);
        return;
      }

      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  const value = {
    doctors,
    setDoctors,
    currencySymbol,
    backendUrl,
    getDoctorsData,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;