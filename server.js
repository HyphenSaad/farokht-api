import express from 'express'
import expressAsyncErrors from 'express-async-errors'
import { BadRequestError, NotFoundError, UnAuthorizedError } from './errors/index.js'
import rateLimit from 'express-rate-limit'
// import morgan from 'morgan'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()

// SEEDING
import { CreateAdmin } from './seed.js'
// DATABASE
import ConnectMongoDB from './configs/database.js'
// ROUTERS
import Router from './routes/index.js'
// MIDDLEWARES
import { NotFoundMiddleware, ErrorHandlerMiddleware } from './middlewares/index.js'

const app = express()
const PORT = process.env.PORT || 4000

const API_RATE_LIMITER = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests!'
})

// app.use(morgan('dev'))
app.use(express.json())
app.use(multer().array())

app.get('/', (req, res) => {
  res.send('saad')
})
app.use('/api/v1/', Router)

app.use(NotFoundMiddleware)
// app.use(ErrorHandlerMiddleware)

const StartServer = async () => {
  try {
    await ConnectMongoDB(process.env.MONGODB_URI)
    await CreateAdmin()
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
  } catch (error) { console.log(`Error: ${error}`) }
}

StartServer()