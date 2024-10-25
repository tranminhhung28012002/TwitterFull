import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './MessageBody.module.scss'
import socket from '../Socket/socket'
import Cookies from 'js-cookie'
import type { Message } from '../../../types'

interface MessageBodyProps {
  receiverId: string
  receiverName: string
}

const LIMIT = 10

export function MessageBody({ receiverId, receiverName }: MessageBodyProps) {
  const [newMessage, setNewMessage] = useState<string>('')
  const [chatMessages, setChatMessages] = useState<Message[]>([]) // Ensure it's initialized as an empty array
  const [senderId, setSenderId] = useState<string>('')
  const [senderName, setSenderName] = useState<string>('') // Thêm state để lưu tên người gửi

  // Fetch sender's ID and name from the API
  useEffect(() => {
    const fetchSenderInfo = async () => {
      const token = Cookies.get('access_token')
      if (!token) return

      try {
        const response = await axios.get('http://localhost:3000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSenderId(response.data.result._id) // Store the sender's ID
        setSenderName(response.data.result.name) // Lưu tên người gửi (giả định có thuộc tính name)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    fetchSenderInfo()
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      const token = Cookies.get('access_token')
      if (!token) return

      try {
        const response = await axios.get(`http://localhost:3000/conversations/receivers/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: LIMIT, page: 1 } // Truyền tham số phân trang
        })
        console.log('Ket noi thanh cong')
        setChatMessages(response.data.messages || []) // Ensure messages are set to an empty array if undefined
      } catch (error) {
        console.error('Lỗi khi tải tin nhắn:', error)
      }
    }

    if (receiverId) {
      fetchMessages()
    }
  }, [receiverId])

  // Socket event handlers
  useEffect(() => {
    socket.on('receive_message', (payload) => {
      // Khi nhận tin nhắn mới từ socket
      setChatMessages((prev) => [...prev, payload]) // Cập nhật danh sách tin nhắn
    })
    return () => {
      socket.off('receive_message')
    }
  }, [])

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Ngăn gửi tin nhắn trống
    if (!newMessage.trim()) return

    const conversation = {
      content: newMessage,
      sender_id: senderId,
      receiver_id: receiverId,
      sender_name: senderName, // Bổ sung tên người gửi
      _id: new Date().getTime().toString() // Ensure _id is a string
    }

    // Gửi tin nhắn qua socket
    socket.emit('send_message', { payload: conversation })
    // Cập nhật danh sách tin nhắn
    setChatMessages((prev) => [...prev, conversation])
    setNewMessage('')
  }

  return (
    <div className={styles.ChatBox}>
      <div className={styles.ChatBox__body}>
        <p className={styles.ChatBox__name}>Chat with {receiverName}</p>
        <div className={styles.messagesContainer}>
          {chatMessages.map((message, index) => (
            <div key={index} className={styles.message}>
              <div className={styles.message__Sender}>{message.receiver_id}:</div> {/* Hiển thị tên người gửi */}
              <div className={styles.message__Content}>{message.content}</div>
            </div>
          ))}
        </div>
      </div>
      <form className={styles.ChatBox__input} onSubmit={handleSendMessage}>
        <input
          type='text'
          value={newMessage}
          placeholder='Start a new message'
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  )
}

export default MessageBody
