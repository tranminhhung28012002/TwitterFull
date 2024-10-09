import { Router } from 'express'
import { accessTokenValidatetor } from '../middlewares/users.middlewares'
import { wrapRequestHandler } from '../../utils/handlerl'
import { searchControler } from '../controllers/search.controlers'
const searchRouter = Router()

searchRouter.get('/Search', accessTokenValidatetor, wrapRequestHandler(searchControler))
searchRouter.post('/search')
export default searchRouter
