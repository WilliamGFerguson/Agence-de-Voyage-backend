import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  travelId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, { _id: false })

export default CartItemSchema