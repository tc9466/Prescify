import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Razorpay from "razorpay";

// API to register user
const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "All fields are required",
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        if (!validator.isLength(password, { min: 8 })) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
        }

        const isUser = await userModel.findOne({ email });

        if (isUser) {
            return res.json({
                success: false,
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        const token = jwt.sign({ userId: user._id },
            process.env.JWT_SECRET, { expiresIn: "180d" }
        );

        res.json({
            success: true,
            message: "User registered successfully",
            token,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to user login
const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign({ userId: user._id },
            process.env.JWT_SECRET, { expiresIn: "180d" }
        );

        res.json({
            success: true,
            message: "User logged in successfully",
            token,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to get user profile data
const getProfile = async(req, res) => {
    try {
        const userId = req.userId;

        const userData = await userModel.findById(userId).select("-password");

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            message: "User profile data retrieved successfully",
            userData,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};

// API to update user profile
const updateProfile = async(req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!userId || !name || !phone || !dob || !gender || !address) {
            return res.json({
                success: false,
                message: "All required fields are missing",
            });
        }

        let parsedAddress = address;

        if (typeof address === "string") {
            parsedAddress = JSON.parse(address);
        }

        const updateData = {
            name,
            phone,
            address: parsedAddress,
            dob,
            gender,
        };

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });
            updateData.image = imageUpload.secure_url;
        }

        await userModel.findByIdAndUpdate(userId, updateData);

        res.json({
            success: true,
            message: "User profile updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to book appointment
const bookAppointment = async(req, res) => {
    try {
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        if (!userId || !docId || !slotDate || !slotTime) {
            return res.json({
                success: false,
                message: "Missing required details",
            });
        }

        const docData = await doctorModel.findById(docId).select("-password");

        if (!docData) {
            return res.json({
                success: false,
                message: "Doctor not found",
            });
        }

        if (!docData.available) {
            return res.json({
                success: false,
                message: "Doctor not available",
            });
        }

        let slots_booked = {...(docData.slots_booked || {}) };

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({
                    success: false,
                    message: "Slot not available",
                });
            }
            slots_booked[slotDate].push(slotTime);
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        const userData = await userModel.findById(userId).select("-password");

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        const docDataObj = docData.toObject();
        delete docDataObj.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: docDataObj,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
            cancelled: false,
            payment: false,
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({
            success: true,
            message: "Appointment Booked",
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to list user appointments
const listAppointment = async(req, res) => {
    try {
        const userId = req.userId;

        const appointments = await appointmentModel
            .find({ userId })
            .sort({ date: -1 });

        res.json({
            success: true,
            appointments,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to cancel appointment
const cancelAppointment = async(req, res) => {
    try {
        const userId = req.userId;
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.json({
                success: false,
                message: "Appointment ID is required",
            });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({
                success: false,
                message: "Appointment not found",
            });
        }

        if (appointmentData.userId.toString() !== userId) {
            return res.json({
                success: false,
                message: "Unauthorized action",
            });
        }

        if (appointmentData.cancelled) {
            return res.json({
                success: false,
                message: "Appointment already cancelled",
            });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            cancelled: true,
        });

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        if (doctorData) {
            let slots_booked = doctorData.slots_booked || {};

            if (slots_booked[slotDate]) {
                slots_booked[slotDate] = slots_booked[slotDate].filter(
                    (time) => time !== slotTime
                );
            }

            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        res.json({
            success: true,
            message: "Appointment Cancelled",
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to make payment of appointment using razorpay
const paymentRazorpay = async(req, res) => {
    try {
        const userId = req.userId;
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.json({
                success: false,
                message: "Appointment ID is required",
            });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({
                success: false,
                message: "Appointment not found",
            });
        }

        if (appointmentData.userId.toString() !== userId) {
            return res.json({
                success: false,
                message: "Unauthorized action",
            });
        }

        if (appointmentData.cancelled) {
            return res.json({
                success: false,
                message: "Appointment is cancelled",
            });
        }

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY || "INR",
            receipt: appointmentId,
        };

        const order = await razorpayInstance.orders.create(options);

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// API TO verify payment of razorpay

const verifyRazorpay = async(req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)


        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successfull" })
        } else {
            res.json({ success: false, message: "Payment failed" })
        }

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
}

export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,

};