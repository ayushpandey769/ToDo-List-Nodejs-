import express from "express"

const app = express()

app.use(express.json({limit: "16kb"}))


// routes
import userRoutes from "./routes/user.routes.js"

app.use("/users", userRoutes)  

export default app