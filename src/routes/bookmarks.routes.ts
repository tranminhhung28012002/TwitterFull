import { Router } from 'express'
import { accessTokenValidatetor, verifiedUserValidator } from '../middlewares/users.middlewares'
import { wrapRequestHandler } from '../../utils/handlerl'
import { bookmarkTweetController, unbookmarkTweetController } from '../controllers/bookmarks.controllers'
import { tweetIdValidator } from '../middlewares/tweets.middlewares'

const bookmarksRouter = Router()

/**
Description: Bookmark Tweet
Path: /
Method: POST
Body: { tweet_id: string }
Header: { Authorization: Beager <access_token> }
*/
bookmarksRouter.post('', accessTokenValidatetor, verifiedUserValidator, wrapRequestHandler(bookmarkTweetController))

/**
Description: Unbookmark Tweet
Path: /tweets/:tweet_id
Method: DELETE
Body: { tweet_id: string }
Header: { Authorization: Beager <access_token> }
*/
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidatetor,
  verifiedUserValidator,
  wrapRequestHandler(unbookmarkTweetController)
)

export default bookmarksRouter
