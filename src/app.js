import express from "express"

const app = express()


// routes
import userRoutes from "./routes/user.routes.js"

app.use("/users", userRoutes)  

export default app