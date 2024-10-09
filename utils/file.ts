import { Console, error } from 'console'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '../src/constants/dir'

//tạo thư mục upload
const checkFoders = [UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR]

checkFoders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true })
    console.log('Thư mục đã được tạo mới:', folder)
  } else {
    console.log('Thư mục đã tồn tại:', folder)
  }
})


export const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}

export const handleUploadImage = async (req: Request) => {
  //const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 4000 * 1024, // 300KB
    maxTotalFileSize:4000 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      //name =image, originalFilename= 0106_hinh-nen-4k-may-tinh4.jpg, mimetype= image/jpeg
      // console.log(name, originalFilename, mimetype)        //name chính là cái key đặt trog form-data trong postman
      const valid = name === 'image' && Boolean(mimetype?.includes('image/')) //kiêm tra xem name có đúng la image không
      if (!valid) {
        form.emit('error' as any, new Error('Loại tệp không hợp lệ') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line prettier/prettier, no-extra-boolean-cast
      if(!Boolean(files.image)){
        return reject(new Error('file emty'))
      }
      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  //const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
    //keepExtensions: true,
    maxFileSize: 500 * 1024 * 1024, // 50MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('Loại tệp không hợp lệ') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      //eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('Tập tin rỗng'))
      }
      const videos = files.video as File[]
      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
      })
      resolve(files.video as File[])
    })
  })
}

export const getExtension = (fullname: string) => {
  const namearr = fullname.split('.')
  return namearr[namearr.length - 1]
}
