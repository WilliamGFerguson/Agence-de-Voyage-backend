import express from "express";
import TravelController from "../controllers/TravelController";

const TravelRouter = express.Router()

TravelRouter.get("/", TravelController.getAll)
TravelRouter.post("/", TravelController.create)
TravelRouter.get("/:travelId", TravelController.getById)
TravelRouter.put("/:travelId", TravelController.update)
TravelRouter.delete("/:travelId", TravelController.delete)

export default TravelRouter