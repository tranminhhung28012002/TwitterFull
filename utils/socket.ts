import { Socket } from 'socket.io'
import { UserVerifyStatus } from '../src/constants/enums'
import HTTP_STATUS from '../src/constants/httpStatus'
import { USERS_MESSAGES } from '../src/constants/Messager'
import { ErrorWithStatus } from '../src/models/Errors'
import { TokenPayload } from './../src/models/requests/Users.Requests'
import { verifyAccessToken } from './common'
import { ObjectId } from 'mongodb'
import { Server as ServerHttp } from 'http'
import { Server } from 'socket.io'
import databaseService from '../src/services/database.services'
import Conversation from '../src/models/schemas/Conversations.schema'

const initSocket = (httpServer: ServerHttp) => {
  // Cấu hình Socket.io với CORS
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3001'] // Địa chỉ của client
    }
  })
  console.log(io)

  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization?.split(' ')[1]
    try {
      const decoded_authorization = await verifyAccessToken(access_token)
      const { verify } = decoded_authorization as TokenPayload

      if (verify !== UserVerifyStatus.verified) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_VERIFIED,
          status: HTTP_STATUS.FORBIDDEN
        })
      }
      // Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token

      next()
    } catch (error) {
      next(new Error('Không được phép'))
    }
  })

  io.on('connection', (socket: Socket) => {
    console.log(`Người dùng ${socket.id} đã kết nối`)

    const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload

    users[user_id] = {
      socket_id: socket.id
    }

    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth
      try {
        await verifyAccessToken(access_token)
        next()
      } catch (error) {
        next(new Error('Không được phép'))
      }
    })

    socket.on('error', (error) => {
      if (error.message === 'Không được phép') {
        socket.disconnect()
      }
    })

    socket.on('send_message', async (data) => {
      try {
        const { sender_id, receiver_id, content } = data.payload

        // Kiểm tra dữ liệu hợp lệ
        if (!sender_id || !receiver_id || !content) {
          return socket.emit('error', { message: 'Dữ liệu không hợp lệ' })
        }

        const receiver_socket_id = users[receiver_id]?.socket_id

        const conversation = new Conversation({
          sender_id: new ObjectId(sender_id),
          receiver_id: new ObjectId(receiver_id),
          content: content
        })

        // Lưu tin nhắn vào MongoDB
        const result = await databaseService.conversations.insertOne(conversation)
        conversation._id = result.insertedId

        if (receiver_socket_id) {
          socket.to(receiver_socket_id).emit('receive_message', {
            payload: conversation
          })
        } else {
          // Có thể xử lý trường hợp người nhận không trực tuyến ở đây
          console.log(`Người nhận không trực tuyến: ${receiver_id}`)
        }
      } catch (error) {
        socket.emit('error', { message: 'Lỗi gửi tin nhắn', error: error.message })
      }
    })

    socket.on('disconnect', () => {
      delete users[user_id]
      console.log(`Người dùng ${socket.id} đã ngắt kết nối`)
    })
  })
}

export default initSocket
