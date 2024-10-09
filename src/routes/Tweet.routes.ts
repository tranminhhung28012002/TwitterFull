import { Router } from 'express'
import {
  accessTokenValidatetor,
  isUserLoggedInValidator,
  verifiedUserValidator
} from '../middlewares/users.middlewares'
import { wrapRequestHandler } from '../../utils/handlerl'
import { createTweetController, getNewFeedsController, getTweetChildrenController, getTweetController, } from '../controllers/tweet.controlers'
import { audienceValidator, createTweetValidator, getTweetChildrenValidator, paginationValidator, tweetIdValidator } from '../middlewares/tweets.middlewares'
const tweetsRouter = Router()
tweetsRouter.post(
  '/',
  accessTokenValidatetor,
  verifiedUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)
tweetsRouter.get(
  '/detailtweet/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidatetor),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetController)
)
tweetsRouter.get( //lấy ra những tweet comment
  '/:tweet_id/children',
  tweetIdValidator,
  paginationValidator,
  getTweetChildrenValidator,
  isUserLoggedInValidator(accessTokenValidatetor),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)
tweetsRouter.get(
  '/new-feed',
  paginationValidator,
  accessTokenValidatetor,
  verifiedUserValidator,
  wrapRequestHandler(getNewFeedsController)
)
export default tweetsRouter
