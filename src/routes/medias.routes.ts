import { wrapRequestHandler } from './../../utils/handlerl'
import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '../controllers/media.controlers'
import { accessTokenValidatetor, verifiedUserValidator } from '../middlewares/users.middlewares'
const mediaRoute = Router()

mediaRoute.post('/upload-Image',accessTokenValidatetor,verifiedUserValidator, wrapRequestHandler(uploadImageController))
mediaRoute.post(
  '/upload-video',
  accessTokenValidatetor,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
)
mediaRoute.post('/')
export default mediaRoute
