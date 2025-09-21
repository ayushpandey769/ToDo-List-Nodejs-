import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const emailVerifyJWT = asyncHandler(async (req, res, next) => {
  const emailToken = req.query?.token || "";

  try {
    const decoded = jwt.verify(emailToken, process.env.EMAIL_TOKEN);


    const user = await User.findOne({
      _id: decoded.userID,
      email: decoded.email,
    });


    if (!user) {
      throw new apiError(400, "Invalid or expired token");
    }


    req.user = user; 
    next();


  } catch (err) {
    throw new apiError(400, "Invalid verification token");
  }
});

export { emailVerifyJWT };
