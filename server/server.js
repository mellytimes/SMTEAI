import express from 'express'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import authRoutes from './routes/auth.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

// Core middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(methodOverride('_method'))

// CORS (safe for dev; with Vite proxy you can remove this)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

// API routes BEFORE static
app.use('/auth', authRoutes)

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }))

// Static (if you serve a built frontend later)
app.use(express.static(path.resolve(__dirname, '../public')))

const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/chat4mind'
  const { readyState } = mongoose.connection
  if (readyState === 1 || readyState === 2) return
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  console.log('Connected to MongoDB')
}

const PORT = process.env.PORT || 5000
const start = async () => {
  await connectDatabase()
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
}

start().catch((e) => {
  console.error('Failed to start server:', e)
  process.exit(1)
})
