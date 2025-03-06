const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    })
    console.log(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`)
  } catch (error) {
    console.error(`MongoDB 连接失败: ${error.message}`)
    // 不要立即退出进程，而是继续尝试重连
    setTimeout(connectDB, 5000)
  }
}

module.exports = connectDB 