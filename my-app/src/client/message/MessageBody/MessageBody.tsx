import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './MessageBody.module.scss'
import socket from '../Socket/socket'
import Cookies from 'js-cookie'

interface Message {
  content: string
}

interface MessageBodyProps {
  receiverId: string
  receiverName: string
  messages: Message[]
}

// Xuất hàm MessageBody
export function MessageBody({ receiverId, receiverName, messages = [] }: MessageBodyProps) {
  const [newMessage, setNewMessage] = useState<string>('')
  const [chatMessages, setChatMessages] = useState<Message[]>(messages)
  const [userInfo, setUserInfo] = useState<string>('')

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get('access_token')
      if (!token) return

      try {
        const { data } = await axios.get('http://localhost:3000/api/me', {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        })
        setUserInfo(data.result)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }
    fetchUserInfo()
  }, [])

  // Cập nhật danh sách tin nhắn khi prop messages thay đổi
  useEffect(() => {
    setChatMessages(messages)
  }, [messages])

  // Lắng nghe tin nhắn mới từ socket
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      setChatMessages((prev) => [...prev, message])
    }
    socket.on('newMessage', handleNewMessage)

    return () => {
      socket.off('newMessage', handleNewMessage)
    }
  }, [])

  // Gửi tin nhắn
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return

    const messageData: Message = {
      content: newMessage
    }

    // Gửi tin nhắn qua socket
    socket.emit('sendMessage', { content: newMessage, receiverId }) // Gửi ID người nhận
    setNewMessage('')
  }

  return (
    <div className={styles.ChatBox}>
      <div className={styles.ChatBox__body}>
        <p className={styles.ChatBox__name}>Chat with {receiverName}</p>
        <div className={styles.messagesContainer}>
          {chatMessages.length > 0 ? (
            chatMessages.map((message, index) => (
              <div key={index} className={styles.message}>
                <div className={styles.messageContent}>{message.content}</div>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
      </div>
      <div className={styles.ChatBox__input}>
        <input
          type='text'
          value={newMessage}
          placeholder='Start a new message'
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  )
}

export default MessageBody // Xuất mặc định
