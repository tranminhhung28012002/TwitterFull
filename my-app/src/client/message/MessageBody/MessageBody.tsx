import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './MessageBody.module.scss'
import socket from '../Socket/socket'
import Cookies from 'js-cookie'

interface Message {
  content: string
  senderId: string
  timestamp: string
  status: 'sent' | 'seen'
}

interface MessageBodyProps {
  receiverId: string
  receiverName: string
  messages: Message[]
}

export default function MessageBody({ receiverId, receiverName, messages = [] }: MessageBodyProps) {
  const [newMessage, setNewMessage] = useState<string>('')
  const [chatMessages, setChatMessages] = useState<Message[]>(messages)
  const [userInfo, setUserInfo] = useState<string>('')

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

  useEffect(() => {
    setChatMessages(messages)
  }, [messages])
  console.log('Message show =>>>>', messages)
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      setChatMessages((prev) => [...prev, message])
    }
    socket.on('newMessage', handleNewMessage)

    return () => {
      socket.off('newMessage', handleNewMessage)
    }
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return

    const messageData = {
      content: newMessage,
      senderId: userInfo,
      receiverId,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }
    socket.emit('sendMessage', messageData)
    setNewMessage('')
  }
  console.log('receiID', receiverId)
  console.log('senderID: ', userInfo)
  return (
    <div className={styles.ChatBox}>
      <div className={styles.ChatBox__body}>
        <p className={styles.ChatBox__name}>Chat with {receiverName}</p>
        <div className={styles.messagesContainer}>
          {chatMessages.length > 0 ? (
            chatMessages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.senderId === userInfo ? styles.messageRight : styles.messageLeft
                }`}
              >
                <div className={styles.messageInfo}>
                  <div className={styles.messageContent}>{message.content}</div>
                  <span className={styles.messageTimestamp}>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  <span className={styles.messageStatus}>{message.status === 'seen' ? 'Đã xem' : 'Đã gửi'}</span>
                </div>
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
