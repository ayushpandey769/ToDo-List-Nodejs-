import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json({limit: "16kb"}))
app.use(cookieParser())


// routes
import userRoutes from "./routes/user.routes.js"

app.use("/users", userRoutes)  

export default app