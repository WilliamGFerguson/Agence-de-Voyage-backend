import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import MainRouter from "./routes/MainRouter"
import errorHandler from "./middleware/errorHandler"
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
const port = 3000

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(cookieParser())
app.use(express.json())

const uri = process.env.CONNECTION_STRING!

mongoose.connect(uri)
    .then(() => console.log("Connected to database"))
    .catch((err) => {
      console.error("Database connection error:", err)
})

app.use("/", MainRouter)
app.use(errorHandler)

app.listen(port)