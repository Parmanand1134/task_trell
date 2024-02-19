import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import api from './routes/index.js'
import cors from "cors";
import connectToDatabase from "./db/connection.js";

connectToDatabase();

const PORT = process.env.SERVER_PORT || 9000
const origin = process.env.CORS_ORIGIN || 'http://localhost:3000'

const app = express()

app.use(cors({
    origin
}));
app.use(express.json())

app.use(api)

// import createRoles from './controllers/roleController.js';
// createRoles()


app.listen(PORT, () => {
    console.log(`Your app is running in http://localhost:${PORT}`)
})