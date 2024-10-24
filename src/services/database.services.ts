import { config } from 'dotenv' // để sử dụng được biến môi trường env
config() // config(): Chức năng này đọc tệp .env và làm cho nội dung của nó có sẵn thông qua process.env
import { MongoClient, Db, Collection } from 'mongodb'
import User from '../models/schemas/User.schema'
import RefreshToken from '../models/schemas/ResfestToken.Schema'
import Followers from '../models/schemas/Follower.schema'
import Tweet from '../models/schemas/Twitter.schema'
import Hashtag from '../models/schemas/Hashtag.Schema'
import Bookmark from '../models/schemas/Bookmark.schema'
import Likes from '../models/schemas/Like.schema'
import Conversation from '../models/schemas/Conversations.schema'

// sử dụng process để trỏ đến file env để sử dụng tài nguyên từ file đó
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.jdianmg.mongodb.net/?retryWrites=true&w=majority&appName=Twitte`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri) //tạo đường dẩn kết nối đến database theo uri(twitter.jdianmg.mongodb.net)
    this.db = this.client.db(process.env.DB_NAME) //chọn ra tên của database cần sử dụng gán vào db
  }

  async connect() {
    try {
      // kết nối từ client đến server
      // await được sử dụng để chờ một Promise. Nó chỉ có thể được sử dụng bên trong một khối async
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Erorr', error)
      throw error
    }
  }
  indexUsers() {
    this.users.createIndex({ email: 1, password: 1 })
    this.users.createIndex({ email: 1 }, { unique: true })
    this.users.createIndex({ username: 1 }, { unique: true })
  }
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  //Nếu collection với tên chỉ định bởi process.env.DB_USERS_COLLECTION đã tồn tại trong cơ sở dữ liệu, thì phương thức này sẽ trả về đối tượng Collection<User> để bạn có thể thao tác với collection đó (DB_REFESH_TOKENS_COLLECTION) trên database.
  //Nếu collection chưa tồn tại, MongoDB sẽ tự động tạo mới collection đó khi bạn thực hiện thao tác ghi
  get refeshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFESH_TOKENS_COLLECTION as string)
  }
  get followers(): Collection<Followers> {
    return this.db.collection(process.env.DB_FOLLOWERS_CQLLECTION as string)
  }

  async indexTweets() {
    const exists = await this.tweets.indexExists(['content_text'])
    if (!exists) {
      this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(process.env.DB_TWEETS_COLLECTION as string)
  }
  get hashtag(): Collection<Hashtag> {
    return this.db.collection(process.env.DB_HASHTAG_CQLLECTION as string)
  }
  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(process.env.DB_BOOKMARKS_COLLECTION as string)
  }
  get likes(): Collection<Likes> {
    return this.db.collection(process.env.DB_LIKES_COLLECTION as string)
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection(process.env.DB_VIDEO_STATUS_CONVERSATION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
