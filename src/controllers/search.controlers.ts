import { TokenPayload } from './../models/requests/Users.Requests'
import { Response, NextFunction } from 'express'
import { searchRequest } from '../models/requests/Search.requests'
import Searchservices from '../services/Search.services'
import CustomRequest from '../type'

export const searchControler = async (
  req: CustomRequest<searchRequest>, // Truyền kiểu dữ liệu cho CustomRequest
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.decoded_authorizations as TokenPayload // Giả sử decoded_authorizations có dạng TokenPayload
    const limit = Number(req.query.limit) || 10 // Giá trị mặc định nếu không có limit
    const page = Number(req.query.page) || 1 // Giá trị mặc định nếu không có page
    const media_type = req.query.media_type as string
     // Lấy giá trị content từ query string
    const conten = req.query.content as string
    console.log(conten) // Log để kiểm tra nội dung của content

    const result = await Searchservices.search({
      limit,
      page,
      media_type: media_type,
      content: conten,
      user_id
    })

    res.json({
      message: 'thông báo thành công',
      result: {
        tweets: result.tweets,
        limit,
        page,
        total_page: Math.ceil(result.total / limit) // Tính số trang
      }
    })
  } catch (error) {
    next(error)
  }
}
