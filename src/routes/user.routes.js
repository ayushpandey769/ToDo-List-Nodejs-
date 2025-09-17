import { Router } from "express";
import { createTask,
         deleteTask,
         getAllTasksByUser,
         getTaskById,
         loginUser,
         logoutUser,
         refreshAccessToken,
         registerUser, 
         updateTask
    } from "../controllers/task.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/auth/register").post(registerUser)
router.route("/auth/login").post(loginUser)



router
.route("/auth/logout")
.post(verifyJWT, logoutUser)


router.route("/auth/refresh-token").post(verifyJWT, refreshAccessToken)


router.route("/create-task").post(verifyJWT, createTask)


router.route("/all-tasks").get(verifyJWT, getAllTasksByUser)


router.route("/taskby-id").get(verifyJWT, getTaskById)


router.route("/update-task").put(verifyJWT, updateTask)


router.route("/delete-task").delete(verifyJWT, deleteTask)





export default router