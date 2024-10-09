import { TokenPayload } from './../models/requests/User.requests'
import { User } from './../models/schemas/User.schema'
import { Request } from 'express'
import { Tweet } from './models/schemas/Twitter.schema'

// Interface tùy chỉnh cho Request để bao gồm các thuộc tính bổ sung
interface CustomRequest<T = any> extends Request {
  user?: User // Tùy chọn: Có thể không có
  decoded_authorizations?: DecodedAuthorization // Tùy chọn: Có thể không có
  decoded_refresh_token?: TokenPayload // Tùy chọn: Có thể không có
  decoded_email_verify_tokens?: TokenPayload // Tùy chọn: Có thể không có
  decoded_forgot_password_token?: TokenPayload
  tweet?: Tweet
  body: T // Đảm bảo rằng body có kiểu được chỉ định
}

export default CustomRequest
