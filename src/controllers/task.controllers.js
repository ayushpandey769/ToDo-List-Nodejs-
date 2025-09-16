import {asyncHandler} from "../utils/asyncHandler.js"
import {apiResponse} from "../utils/apiResponse.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"


const registerUser = asyncHandler(async (req , res) => {
    res.status(200)
    .json({
        message: "Harsh Pandey"
    })


})


export {
    registerUser
}