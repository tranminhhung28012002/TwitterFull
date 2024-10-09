import { Request } from 'express'
import sharp from 'sharp'
import { config } from 'dotenv'
import { getNameFromFullname, handleUploadImage, handleUploadVideo } from '../../utils/file'
import { UPLOAD_IMAGE_DIR } from '../constants/dir'
import path from 'path'
import { isProduction } from '../constants/config'
import { MediaType } from '../constants/enums'
import { Media } from '../Other'
import fs from 'fs'
config()

class MediasService {
  async uploadImage(req: Request): Promise<Media[]> {
    // Xử lý upload và lấy danh sách file
    const files = await handleUploadImage(req)
    
    // Xử lý từng file và trả về thông tin của ảnh
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        // Tạo tên mới cho file ảnh
        const newName = getNameFromFullname(file.newFilename)

        // Đường dẫn lưu ảnh đã chuyển đổi
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)

        // Sử dụng sharp để chuyển đổi ảnh sang định dạng JPEG
        await sharp(file.filepath).jpeg().toFile(newPath)

        // // Xóa ảnh gốc tạm thời (nếu cần)
        // fs.unlinkSync(file.filepath)

        // Trả về thông tin ảnh đã chuyển đổi
        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )

    // Trả về mảng các thông tin ảnh
    return result
  }
  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = files.map((file) => {
      return {
        url: isProduction
          ? `${process.env.HOST}/static/video/${file.newFilename}`
          : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
        type: MediaType.Video
      }
    })
    return result
  }
}

const mediasService = new MediasService()
export default mediasService
