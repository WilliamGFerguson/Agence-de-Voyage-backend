import express from "express"
import UserRouter from "./UserRouter"
import TravelRouter from "./TravelRouter"
import UserController from "../controllers/UserController"

const MainRouter = express.Router()

MainRouter.use("/users", UserRouter)
MainRouter.use("/travels", TravelRouter)
MainRouter.post("/signup", UserController.signUp)
MainRouter.post("/login", UserController.login)
MainRouter.post("/logout", UserController.logout)

export default MainRouter