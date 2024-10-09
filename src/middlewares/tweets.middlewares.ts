import { numberEnumToArray } from './../../utils/common'
import { checkSchema } from 'express-validator'
import { validate } from '../../utils/validation'
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '../constants/enums'
import { TWEETS_MESSAGES, USERS_MESSAGES } from '../constants/Messager'
import { isEmpty, values } from 'lodash'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '../models/Errors'
import HTTP_STATUS from '../constants/httpStatus'
import databaseService from '../services/database.services'
import Tweet from '../models/schemas/Twitter.schema'
import { Request, Response, NextFunction, query } from 'express' // Đảm bảo import từ express
import CustomRequest from '../type'
import { wrapRequestHandler } from '../../utils/handlerl'
import { error } from 'console'

const tweetType = numberEnumToArray(TweetType)
const tweetAudiences = numberEnumToArray(TweetAudience)
const mediaTypes = numberEnumToArray(MediaType)
export const createTweetValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [tweetType],
        errorMessage: TWEETS_MESSAGES.INVALID_TYPE
      }
    },
    audience: {
      isIn: {
        options: [tweetAudiences],
        errorMessage: TWEETS_MESSAGES.INVALID_AUDIENCE
      }
    },
    parent_id: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          //Điều kiện này kiểm tra xem type có thuộc các loại tweet như Retweet, Comment, hay QuoteTweet không.
          // Nếu đúng, parent_id phải là một tweet_id hợp lệ của một tweet cha.
          if ([TweetType.Retweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) && !ObjectId.isValid(value)) {
            throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
            //Nếu parent_id không hợp lệ, ném ra một lỗi với thông báo
          }
          //Điều kiện này kiểm tra nếu loại tweet là Tweet (một tweet gốc, không phải retweet, comment, hoặc quote tweet).
          //Trong trường hợp này, parent_id phải bằng null vì tweet gốc không có tweet cha.
          if (type === TweetType.Tweet && value !== null) {
            throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_NULL)
          }
          return true
        }
      }
    },
    content: {
      isString: true,
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          const hashtags = req.body.hashtags as string[]
          const mentions = req.body.mentions as string[]
          // Nếu 'type' là comment, quotetweet, tweet và không có 'mentions' và'hashtags'
          //và nội dung content cũng là chuỗi rỗng (value === ''), thì sẽ ném ra lỗi với thông báo "CONTENT_MUST_BE_A_NON_EMPTY_STRING".
          if (
            //Đoạn mã này được sử dụng để kiểm tra xem type có thuộc vào các loại tweet cụ thể (Comment, QuoteTweet, Tweet) không.
            //Nếu thuộc vào một trong các loại này, các điều kiện kiểm tra khác sẽ được áp dụng (như kiểm tra hashtags và mentions, và nội dung content không được rỗng).
            [TweetType.Comment, TweetType.QuoteTweet, TweetType.Tweet].includes(type) &&
            isEmpty(hashtags) &&
            isEmpty(mentions) &&
            value === ''
          ) {
            throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
          }
          // Với Retweet, nội dung content phải luôn là chuỗi rỗng vì retweet chỉ chia sẻ lại tweet mà không cần nội dung mới.
          if (type === TweetType.Retweet && value !== '') {
            throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_EMPTY_STRING)
          }
          return true
        }
      }
    },
    hashtags: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần từ trong array là string
          if (value.some((item: any) => typeof item !== 'string')) {
            throw new Error(TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
          }
          return true
        }
      }
    },
    mentions: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần từ trong array là Media ObjectId
          if (value.some((item: any) => !ObjectId.isValid(item))) {
            throw new Error(TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
          }
          return true
        }
      }
    },
    medias: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần từ trong array là Media Object
          if (
            value.some((item: any) => {
              return typeof item.url !== 'string' || !mediaTypes.includes(item.type)
            })
          ) {
            throw new Error(TWEETS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECTS)
          }
          return true
        }
      }
    }
  })
)
export const tweetIdValidator = validate(
  checkSchema(
    {
      tweet_id: {
        custom: {
          options: async (value, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: TWEETS_MESSAGES.INVALID_TWEET_ID
              })
            }
            const [tweet] = await databaseService.tweets
              .aggregate<Tweet>([
                {
                  $match: {
                    _id: new ObjectId(value)
                  }
                },
                {
                  $lookup: {
                    from: 'hashtags',
                    localField: 'hashtags',
                    foreignField: '_id',
                    as: 'hashtags'
                  }
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'mentions',
                    foreignField: '_id',
                    as: 'mentions'
                  }
                },
                {
                  $addFields: {
                    mentions: {
                      $map: {
                        input: '$mentions',
                        as: 'mention',
                        in: {
                          _id: '$$mention._id',
                          name: '$$mention.name',
                          username: '$$mention.username',
                          email: '$$mention.email'
                        }
                      }
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'bookmarks',
                    localField: '_id',
                    foreignField: 'tweet_id',
                    as: 'bookmarks'
                  }
                },
                {
                  $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'tweet_id',
                    as: 'likes'
                  }
                },
                {
                  $lookup: {
                    from: 'tweets',
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'tweet_children'
                  }
                },
                {
                  $addFields: {
                    bookmarks: {
                      $size: '$bookmarks'
                    },
                    likes: {
                      $size: '$likes'
                    },
                    retweet_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'item',
                          cond: {
                            $eq: ['$$item.type', TweetType.Retweet]
                          }
                        }
                      }
                    },
                    commet_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'item',
                          cond: {
                            $eq: ['$$item.type', TweetType.Comment]
                          }
                        }
                      }
                    },
                    quote_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'item',
                          cond: {
                            $eq: ['$$item.type', TweetType.QuoteTweet]
                          }
                        }
                      }
                    },
                    views: {
                      $add: ['$user_views', '$guest_views']
                    }
                  }
                },
                {
                  $project: {
                    tweet_children: 0 //dùng để ẩn đi tweet_children
                  }
                }
              ])
              .toArray()
            //console.log(tweet)

            if (!tweet) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: TWEETS_MESSAGES.TWEET_NOT_FOUND
              })
            }
            ;(req as CustomRequest).tweet = tweet
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)
// Muốn sử dụng async await trong handler express thi phải có try catch
// Nếu không dùng try catch thì phải dùng wrapRequestHandler
export const audienceValidator = wrapRequestHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const tweet = req.tweet as Tweet

  if (tweet.audience === TweetAudience.TwitterCircle) {
    // Kiểm tra người xem tweet này đã đăng nhập hay chưa
    if (!req.decoded_authorizations) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
      })
    }

    // Lấy tác giả của tweet
    const author = await databaseService.users.findOne({
      _id: new ObjectId(tweet.user_id)
    })

    // Kiểm tra tài khoản tác giả có ổn (bị khóa hay bị xóa chưa) không
    if (!author || author.verify === UserVerifyStatus.Banned) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGES.USERS_NOT_FOUND
      })
    }

    const { user_id } = req.decoded_authorizations

    // Kiểm tra xem người dùng đang muốn xem tweet(người dùng hiện tại đang đăng nhập) thì coi có nằm trong `twitter_circle` của tác giả đăng tweet
    //không nếu có thì cho xem tweet còn nếu không có thì ko cho xem
    const isInTwitterCircle =
      Array.isArray(author.twitter_circle) &&
      author.twitter_circle.some((user_circle_id) => user_circle_id.equals(user_id))

    // Nếu không phải là tác giả và không nằm trong twitter circle thì quăng lỗi
    if (!author._id.equals(user_id) && !isInTwitterCircle) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.FORBIDDEN,
        message: TWEETS_MESSAGES.TWEET_IS_NOT_PUBLIC
      })
    }
  }

  next() // Cho phép tiếp tục nếu không có lỗi
})

export const getTweetChildrenValidator = validate(
  checkSchema(
    {
      tweet_type: {
        isIn: {
          options: [tweetType],
          errorMessage: TWEETS_MESSAGES.INVALID_TYPE
        }
      }
    },
    ['query']
  )
)

export const paginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        custom: {
          options: async (value, { req }) => {
            const num = Number(value)
            if (num > 100 || num < 1) {
              throw new Error('1 <= limit <= 100')
            }
            return true
          }
        }
      },
      page: {
        isNumeric: true,
        custom: {
          options: async (value, { req }) => {
            const num = Number(value)
            if (num < 1) {
              throw new Error('page >= 1')
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
