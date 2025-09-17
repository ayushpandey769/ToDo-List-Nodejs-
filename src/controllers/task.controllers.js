import {asyncHandler} from "../utils/asyncHandler.js"
import {apiResponse} from "../utils/apiResponse.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import jwt from "jsonwebtoken"
import { Task } from "../models/task.models.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
    
        return {accessToken , refreshToken}
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating access and refresh token")
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

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken , options)
    .cookie("refreshToken", refreshToken , options)
    .json(new apiResponse(
        200,
        loggedInUser,
        "User logged in successfully"
    ))

})



const logoutUser = asyncHandler( async(req , res) => {
    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {} , "User logged out"))
})


const refreshAccessToken = asyncHandler(async(req , res) => {

  const incomingRefreshToken = req.cookies.refreshToken 

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      )
  
    const user = await User.findById(decodedToken?._id)
  
    if (!user) {
      throw new apiError(401, "Invalid refresh token")
    }
  
    if(incomingRefreshToken !== user?.refreshToken){
      throw new apiError(401, "Refresh token is expeired or used")
    }
  
    const options = {
      httpOnly: true,
      secure: true
    }
    // whaya wala error
    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
  
    return res
    .status(200)
    .cookie("accessToken", accessToken , options)
    .cookie("refreshToken", refreshToken , options)
    .json(
      new apiResponse(
        200,
        {accessToken , refreshToken: refreshToken},
        "Access token refreshed successfully"
      )
    )
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token")
  }
})


const createTask = asyncHandler( async(req , res) => {

    const currentUser = await User.findById(req.user?._id)

    if (!currentUser) {
        throw new apiError(400, "User does not exists")
    }

    const {taskName , taskDescription} = req.body

    if (taskName.trim() === "") {
        throw new apiError(400, "Task name is required")
    }

    const existedTask = await Task.findOne({taskName})

    if (existedTask) {
        throw new apiError(400, "This task already exists")
    }

    const task = await Task.create({
        taskName,
        taskDescription: taskDescription.trim() === "" ? "No description" : taskDescription,
        owner: currentUser._id
    });
    
    const createdTask = await Task.findById(task._id)

    if (!createdTask) {
        throw new apiError(500, "Something went wrong while creating the task");
    }


    return res
    .status(200)
    .json(new apiResponse(
        200,
        createdTask,
        "Task created successfully"
    ))


})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    createTask
}