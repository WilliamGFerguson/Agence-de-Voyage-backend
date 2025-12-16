import mongoose from "mongoose";
import CartItemSchema from "./CartModel";

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "manager", "admin"]
    },
    liked: {
      type: [String],
      default: []
    },
    cart: {
      type: [CartItemSchema],
      default: []
    } 
}, {timestamps: true})

const UserModel = mongoose.model("users", UserSchema)

export default UserModel