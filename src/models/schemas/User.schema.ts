import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '../../constants/enums'

interface UserType {
  _id?: ObjectId
  name: string //thêm dấu ? vào nghỉa là trường name có thể là kiểu String hoặc là undefined
  email: string
  date_of_birth: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  twitter_circle?: ObjectId[] // danh sách id của những người mà user này add vào circle
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  twitter_circle: ObjectId[] // danh sách id của những người mà user này add vào circle
  bio: string
  location: string
  website: string
  username: string
  avatar: string
  cover_photo: string

  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id
    this.name = user.name || '' // mac dinh rong
    this.email = user.email
    this.date_of_birth = user.date_of_birth || new Date()
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified //mac dinh =0
    this.twitter_circle = user.twitter_circle || []
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
    this.location = user.location || ''
    this.username = user.username || ''
  }
}
