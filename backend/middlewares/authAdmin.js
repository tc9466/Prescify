import jwt from "jsonwebtoken";

const authAdmin = async(req, res, next) => {
    try {
        const { atoken } = req.headers;

        if (!atoken) {
            return res.json({
                success: false,
                message: "Not Authorized login again",
            });
        }

        // verify token
        const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

        // check admin credentials
        if (
            decoded.email !== process.env.ADMIN_EMAIL ||
            decoded.password !== process.env.ADMIN_PASSWORD
        ) {
            return res.json({
                success: false,
                message: "Not Authorized login again",
            });
        }

        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        res.json({
            success: false,
            message: "Invalid or Expired Token",
        });
    }
};

export default authAdmin;