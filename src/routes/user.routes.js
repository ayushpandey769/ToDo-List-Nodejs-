import { Router } from "express";
import { loginUser,
         logoutUser,
         refreshAccessToken,
         registerUser 
    } from "../controllers/task.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/auth/register").post(registerUser)
router.route("/auth/login").post(loginUser)



router.route("/auth/logout").post(verifyJWT, logoutUser)
router.route("/auth/refresh-token").post(verifyJWT, refreshAccessToken)



export default router