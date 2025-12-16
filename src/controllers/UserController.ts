import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import Travel from "../models/Travel";
import jwt from "jsonwebtoken";
import createError from "../utils/createError";
import { validRole } from "../types/Role";

const UserController = {
    async getAll (_req: Request, res: Response, next: NextFunction) {
        try {
            const users = await User.getAll()
            if (users.length === 0) {
                return next(createError("No user found in database", 404, "USER_NOT_FOUND"))
            }

            res.status(200).json(users)
        } catch (err) {
            next(err)
        }
    },

    async getById (req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId

            const user = await User.getById(userId)
            if (!user) {
                return next(createError("User not found", 404, "USER_NOT_FOUND"))
            }

            res.status(200).json(user)
        } catch (err) {
            next(err)
        }
    },

    async getByName (req: Request, res: Response, next: NextFunction) {
        try {
            const username = req.body.username

            const user = await User.getByName(username)
            if (!user) {
                return next(createError("User not found", 404, "USER_NOT_FOUND"))
            }

            res.status(200).json(user)
        } catch (err) {
            next(err)
        }
    },

    async getByToken (req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token
            if (!token) {
                return next(createError("Token is missing", 401, "TOKEN_MISSING"))
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

            if (!decoded?.id || typeof decoded.id !== "string") {
                return next(createError("Invalid token", 401, "INVALID_TOKEN"))
            }

            const user = await User.getById(decoded.id)
            if (!user) {
                return next(createError("User not found", 404, "USER_NOT_FOUND"))
            }

            res.status(200).json(user)
        } catch (err) {
            next(err)
        }
    },

    async signUp (req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body

            const err = await User.verify(data)
            if (err) {
                return next(err)
            }

            data.role ||= "user"

            const user = await User.signUp(data)

            res.status(200).json(user)
        } catch (err) {
            next(err)
        }
    },

    async login (req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body
            const user = await User.getByName(username)
            if (!user) {
                return next(createError("User not found", 404, "USER_NOT_FOUND"))
            }

            if (user.password !== password) {
                return next(createError("Invalid password", 401, "INVALID_PASSWORD"))
            }

            const payload = {
                id: user.id,
                role: user.role
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "24h" })
            res.cookie("token", token, {
                httpOnly: true
            })

            return res.status(200).send(token)
        } catch (err) {
            next(err)
        }
    },

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.cookies.token) {
                    res.clearCookie("token", {
                    httpOnly: true
                });
            }
        } catch (err) {
            next(err)
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId
            const data = req.body

            const err = await User.verify(data)
            if (err) {
                return next(err)
            }

            const user = await User.update(userId, data)
            if (!user) {
                return next(createError("User not found", 404, "USER_NOT_FOUND"))
            }

            res.status(200).json(user)
        } catch (err) {
            next(err)
        }
    },

    async modifyRole(req: Request, res: Response, next: NextFunction) {
        try {
            const currentUser = (req as any).user
            const userId = req.params.userId
            const { role } = req.body

            if (!validRole.includes(role)) {
                return next(createError("Invalid role", 401, "INVALID_ROLE"))
            }

            const user = await User.getById(userId)
            if (!user) {
                return next(createError("User not found", 404, "USER_NOT_FOUND"))
            }

            if (currentUser.role === 'manager' && role === 'admin') {
                return next(createError("Managers are not authorized to assign the admin role", 401, "UNAUTHORIZED" ))
            }

            user.role = role
            await user.save()

            res.status(200).json(`${user.username} role changed to ${user.role}`)
        } catch (err) {
            next(err)
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId

            const user = await User.delete(userId)
            if (!user) {
                return next(createError("User not found", 404, "USER_NOT_FOUND"))
            }

            res.status(200).json(`User ${user.username} deleted`)
        } catch (err) {
            next(err)
        }
    },

    async handleLike(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId
            const { action, travelId } = req.body
            let actionMessage = ""

            switch (action) {
                case 'like':
                    await User.addToLiked(userId, travelId)
                    actionMessage = "added to"
                    break;
                case 'dislike':
                    await User.removeFromLiked(userId, travelId)
                    actionMessage = "deleted from"
                    break;
                default:
                    return next(createError("Invalid requested action", 400, "INVALID_ACTION"))
            }

            res.status(200).json(`Travel ${actionMessage} 'Liked'`)
        } catch (err) {
            next(err)
        }
    },

    async updateCart(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId
            const { action, travelId, quantity } = req.body
            let result

            const [user, travel] = await Promise.all([
                User.getById(userId),
                Travel.getById(travelId)
            ])
            
            if (!user) {
                return next(createError("User not found", 404, "USER_NOT_FOUND"))
            }
            if (!travel) {
                return next(createError("Travel not found", 404, "TRAVEL_NOT_FOUND"))
            }

            switch (action) {
                case 'add':
                    result = await User.addToCart(userId, travelId, quantity)
                    break;
                case 'remove':
                    result = await User.deleteFromCart(userId, travelId)
                    break;
                default:
                    return next(createError("Invalid requested action", 400, "INVALID_ACTION"))
            }

            res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    },

    async clearCart(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId
            const user = await User.getById(userId)

            if (!user) {
                return next(createError("User not found", 404, "USER_NOT_FOUND"))
            }

            await User.clearCart(userId)
            res.status(200).json('Cart cleared')
        } catch (err) {
            next(err)
        }
    }
}

export default UserController