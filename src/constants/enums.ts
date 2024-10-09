export enum UserVerifyStatus {
  Unverified, //chưa xác thực email mặc định bằng 0
  verified, //đã xác thực email
  Banned //bị khóa
}
export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum MediaType {
  Image,
  Video,
  HLS
}
export enum MediaTypeQuery {
  Image ='image',
  Video ='video'
}
export enum EncodingStatus {
  Pending, // Đang chờ ở hàng đợi (chưa được encode)
  Processing, // Đang encode
  Success, // Encode thành công
  Failed // Encode thất bại
}

export enum TweetAudience {
  Everyone, // 0 tất cả mọi người
  TwitterCircle // 1 vòng tròn bạn bè mới thấy được 
}

export enum TweetType {
  Tweet, // tweet gốc
  Retweet, //chia sẻ tweet và không chỉnh sửa gì cả
  Comment, // Bình luận
  QuoteTweet //Người dùng chia sẻ lại tweet của người khác và có thể thêm nhận xét hoặc nội dung riêng của họ.
}
