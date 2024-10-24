import DatabaseService from './services/database.services'
import UserRouter from './routes/users.routes'
import express from 'express'
import { defaultErrorHandler } from './middlewares/ErrorHandler'
import path from 'path'
import cors from 'cors' // Import cors
import mediaRoute from './routes/medias.routes'
import staticRouter from './routes/static.routes'
import tweetsRouter from './routes/Tweet.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
import conversationsRouter from './routes/conversations.routes'

const app = express()
const port = 3000

app.use(
  cors({
    origin: 'http://localhost:3001', // Địa chỉ của ứng dụng frontend
    credentials: true // Cho phép gửi cookie cùng với request
  })
)
app.use(express.json())

// Middleware để phục vụ các file tĩnh
app.use(express.static(path.join(__dirname, 'build')))

app.use('/api', UserRouter)
app.use('/media', mediaRoute)
app.use('/bookmark', bookmarksRouter)
app.use('/like', likesRouter)
app.use('/static', staticRouter) // dùng để chạy những file video hay ảnh tĩnh
app.use('/tweet', tweetsRouter)
app.use('/searchTweets', searchRouter)

app.use('/conversations', conversationsRouter)

//database
DatabaseService.connect().then(() => {
  DatabaseService.indexUsers()
  DatabaseService.indexTweets()
})

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})
