import TravelModel from "./TravelModel";
import createError from "../utils/createError";
import mongoose from "mongoose";

class Travel {
    id: string;
    title: string;
    description: string;
    destination: string;
    price: number;
    img_url: string;
    poi: number;
    departure_date: string;
    arrival_date: string;
    type: string;

    constructor(travel: Travel) {
        this.id = travel.id
        this.title = travel.title
        this.description = travel.description
        this.destination = travel.destination
        this.price = travel.price
        this.img_url = travel.img_url
        this.poi = travel.poi
        this.departure_date = travel.departure_date
        this.arrival_date = travel.arrival_date
        this.type = travel.type
    }

    static verify(travel: Travel) {      
        if (this.isInvalidString(travel.title)) {return createError("Invalid title", 409, "INVALID_TITLE")}
        if (this.isInvalidString(travel.description)) {return createError("Invalid description", 409, "INVALID_DESCRIPTION")}
        if (this.isInvalidString(travel.destination)) {return createError("Invalid destination", 409, "INVALID_DESTINATION")}
        if (this.isInvalidNumber(travel.price)) {return createError("Invalid price", 409, "INVALID_PRICE")}
        if (this.isInvalidString(travel.img_url)) {return createError("Invalid image URL", 409, "INVALID_URL")}
        if (this.isInvalidNumber(travel.poi)) {return createError("Invalid POI", 409, "INVALID_POI")}
        if (this.isInvalidString(travel.departure_date)) {return createError("Invalid departure date", 409, "INVALID_DEP_DATE")}
        if (this.isInvalidString(travel.arrival_date)) {return createError("Invalid arrival date", 409, "INVALID_ARR_DATE")}
        if (this.isInvalidString(travel.type)) {return createError("Invalid type", 409, "INVALID_TYPE")}
        return null
    }

    static isInvalidString(str: string) {
        return typeof str !== 'string' || !str
    }

    static isInvalidNumber(num: number) {
        return isNaN(num) || num < 0 || typeof num !== 'number'
    }

    static async getAll(skip: number, limit: number) {
        let query = TravelModel.find()
        if (skip) {
            query = query.skip(skip)
        }
        if (limit) {
            query = query.limit(limit)
        }
        return await query.exec()
    }

    static getById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null
        }
        return TravelModel.findById(id)
    }

    static getByDestination(dest: string) {
        return TravelModel.find({ destination: dest })
    }

    static create(travel: Travel) {
        return TravelModel.create(travel)
    }

    static update(id: string, travel: Travel) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null
        }
        return TravelModel.findByIdAndUpdate(id, travel, { new: true, runValidators: true })
    }

    static delete(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null
        }
        return TravelModel.findByIdAndDelete(id)
    }

    static count() {
        return TravelModel.countDocuments({})
    }
}

export default Travel