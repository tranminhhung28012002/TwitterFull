import { io } from 'socket.io-client'

// Kết nối với server qua socket.io
const socket = io('http://localhost:3000', {
  auth: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  }
})

export default socket
