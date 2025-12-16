import UserModel from "./UserModel";
import createError from "../utils/createError";
import mongoose from "mongoose";
import { CartData } from "../types/Cart";
import Travel from "./Travel";

class User {
    id: string | null;
    username: string;
    password: string;
    role: string;
    liked: string[];
    cart: CartData[];

    constructor(user: User) {
        this.id = user.id || null
        this.username = user.username
        this.password = user.password
        this.role = user.role
        this.liked = user.liked
        this.cart = user.cart
    }

    static async verify(user: User) {
        if (!user.username) {return createError("Username can't be empty", 409, "INVALID_USERNAME")}
        if (!user.password) {return createError("Password can't be empty", 409, "INVALID_PASSWORD")}
        if (!Array.isArray(user.liked)) {user.liked = []}
        if (!Array.isArray(user.cart)) {user.cart = []}
        const userFound = await UserModel.findOne({ username: user.username })
        if (userFound) {
            return createError("Username already exist", 409, "USERNAME_TAKEN")
        }
        return null
    }

    static getAll() {
        return UserModel.find()
    }

    static getById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null
        }
        return UserModel.findById(id)
    }

    static getByName(name: string) {
        return UserModel.findOne({ username: name })
    }

    static signUp(user: User) {
        return UserModel.create(user)
    }

    static update(id: string, user: User) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null
        }
        return UserModel.findByIdAndUpdate(id, user, { new: true, runValidators: true })
    }

    static delete(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null
        }
        return UserModel.findByIdAndDelete(id)
    }

    static async addToLiked(userId: string, travelId: string) {
        const [user, travel] = await Promise.all([
            User.getById(userId),
            Travel.getById(travelId)
        ])

        if (!user) {
            throw createError("User not found", 404, "USER_NOT_FOUND")
        }
        if (!travel) {
            throw createError("Travel not found", 404, "TRAVEL_NOT_FOUND")
        }
        
        if(!user.liked.includes(travelId)) {
            user.liked.push(travelId)
            await user.save()
        }
    }

    static async removeFromLiked(userId: string, travelId: string) {
        const user = await User.getById(userId)
        if (!user) {
            throw createError("User not found", 404, "USER_NOT_FOUND")
        }

        const index = user.liked.indexOf(travelId)
        if (index !== -1) {
            user.liked.splice(index, 1)
            await user.save()
        }
    }

    static async addToCart(userId: string, travelId: string, quantity: number = 1) {
        const [user, travel] = await Promise.all([
            User.getById(userId),
            Travel.getById(travelId)
        ])
        
        if (!user) {
            throw createError("User not found", 404, "USER_NOT_FOUND")
        }
        if (!travel) {
            throw createError("Travel not found", 404, "TRAVEL_NOT_FOUND")
        }
        if (isNaN(quantity) || quantity < 1) {
            throw createError("Invalid quantity", 400, "INVALID_QUANTITY")
        }

        const existingItem = user.cart.find(item => item.travelId === travelId)
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            user.cart.push({
                travelId: travelId,
                quantity: quantity
            })
        }

        await user.save()
        return `${user.username} added ${quantity} tickets to ${travel.id} to cart`
    }

    static async deleteFromCart(userId: string, travelId: string) {
        const user = await User.getById(userId)
        
        if (!user) {
            throw createError("User not found", 404, "USER_NOT_FOUND")
        }

        const index = user.cart.findIndex(item => item.travelId === travelId)
        const travel = index !== -1 ? user.cart[index] : null

        if (!travel) {
            throw createError("Travel not found in cart", 404, "TRAVEL_NOT_FOUND")
        }

        if (travel.quantity > 1) {
            travel.quantity -= 1
        } else {
            user.cart.splice(index, 1)
        }
        
        await user.save()
        return `${user.username} deleted ${travelId} from cart`
    }

    static async clearCart(userId: string) {
        return UserModel.updateOne(
            { _id: userId },
            { $set: { cart: [] } }
        )
    }
}

export default User