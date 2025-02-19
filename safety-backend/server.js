require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./config/db')

// 连接数据库
connectDB()

const app = express()

// 中间件
app.use(cors({
  origin: ['http://10.31.235.91:5173', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())

// 路由
app.use('/api/safety', require('./routes/safetyRoutes'))
app.use('/api/safety/wechat', require('./routes/wechatRoutes'))

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  })
})

const PORT = process.env.PORT || 3000
const HOST = '0.0.0.0'

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`)
})