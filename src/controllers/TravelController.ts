import { NextFunction, Request, Response } from "express";
import Travel from "../models/Travel";
import createError from "../utils/createError";

const TravelController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit)

            if ((isNaN(page) || page < 1)) {
                return next(createError("Invalid page requested", 400, "INVALID_PAGE"))
            }

            const skip = (page - 1) * limit
            let travelCount = await Travel.count()
            let travels = await Travel.getAll(skip, limit)

            if (travels.length === 0) {
                return next(createError("No travel found in database", 404, "TRAVEL_NOT_FOUND"))
            }

            res.status(200).json({
                travels,
                travelCount
            })
        } catch (err) {
            next(err)
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const travelId = req.params.travelId
            const travel = await Travel.getById(travelId)
            if (!travel) {
                return next(createError("Travel not found", 404, "TRAVEL_NOT_FOUND"))
            }
            res.status(200).json(travel)
        } catch (err) {
            next(err)
        }
    },

    async getByDestination(req: Request, res: Response, next: NextFunction) {
        try {
            const destination = req.params.destination
            const travels = await Travel.getByDestination(destination)
            if (travels.length === 0) {
                return next(createError("No travel with requested destination found", 404, "TRAVEL_NOT_FOUND"))
            }
            res.status(200).json(travels)
        } catch (err) {
            next(err)
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body
            const err = await Travel.verify(data)
            if (err) {
                return next(err)
            }
            const travel = await Travel.create(data)
            res.status(200).json(travel)
        } catch (err) {
            next(err)
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const travelId = req.params.travelId
            const data = req.body
            const err = Travel.verify(data)
            if (err) {
                return next(err)
            }
            const travel = await Travel.update(travelId, data)
            if (!travel) {
                return next(createError("Travel not found", 404, "TRAVEL_NOT_FOUND"))
            }
            res.status(200).json(travel)
        } catch (err) {
            next(err)
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const travelId = req.params.travelId
            const deletedtravel = await Travel.delete(travelId)
            if (!deletedtravel) {
                return next(createError("Travel not found", 404, "TRAVEL_NOT_FOUND"))
            }
            res.status(200).json(`Travel '${deletedtravel.title}' deleted`)
        } catch (err) {
            next(err)
        }
    }
}

export default TravelController