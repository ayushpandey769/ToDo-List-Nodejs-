import {asyncHandler} from "../utils/asyncHandler.js"
import {apiResponse} from "../utils/apiResponse.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new apiError(404, "User not found");
    }
    console.log("User found:", user._id);

    const accessToken = user.generateAccessToken();
    console.log("Access token generated");

    const refreshToken = user.generateRefreshToken();
    console.log("Refresh token generated");

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    console.log("User saved with refresh token");

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new apiError(500, "Something went wrong while generating Access and Refresh Tokens");
  }
}


const registerUser = asyncHandler(async (req , res) => {
    const {email , password} = req.body;

    if (
        [email , password].some((field) => field?.trim() === "")
    ) {
        throw new apiError(400, "All fields required")
    }

    const existedUser = await User.findOne({email})

    if (existedUser) {
        throw new apiError(409, "User already exists")
    }

    const user = await User.create({
        email,
        password
    })

    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering")
    }

    return res
    .status(200)
    .json(new apiResponse(200 , createdUser , "User registered successfully"))

})

const loginUser = asyncHandler( async(req , res) => {
    const {email , password} = req.body

    if (!(email && password)) {
        throw new apiError(400, "All fields are required")
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new apiError(400, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)


    if (!isPasswordValid) {
        throw new apiError(400, "Incorrect password")
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password")

    return res
    .status(200)
    .json(new apiResponse(
        200,
        loggedInUser,
        "User logged in successfully"
    ))

})


export {
    registerUser,
    loginUser
}