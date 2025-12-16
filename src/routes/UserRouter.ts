import express from "express"
import UserController from "../controllers/UserController"
import { jwtAuth } from "../middleware/jwtAuth"

const UserRouter = express.Router()

UserRouter.get("/", UserController.getAll)
UserRouter.get("/me", UserController.getByToken)
UserRouter.get("/:userId", UserController.getById)
UserRouter.put("/:userId", UserController.update)
UserRouter.delete("/:userId", UserController.delete)
UserRouter.patch("/:userId", UserController.handleLike)
UserRouter.patch("/role/:userId", jwtAuth, UserController.modifyRole)
UserRouter.patch("/cart/:userId", UserController.updateCart)
UserRouter.patch("/clear-cart/:userId", UserController.clearCart)

export default UserRouter