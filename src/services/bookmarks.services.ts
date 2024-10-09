import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Bookmark from '../models/schemas/Bookmark.schema'

//tạo đánh dấu tweets mà bạn thích
class BookmarkService {
  async bookmarkTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    console.log(result)
    //return result.value as WithId<Bookmark> tùy máy
    return result
  }

  async unbookmarkTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    console.log(result)
    //return result.value as WithId<Bookmark> //tùy máy
    return result
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService