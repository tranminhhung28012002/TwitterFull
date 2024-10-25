import { useEffect, useState, useRef } from 'react'
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
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [senderId, setSenderId] = useState<string>('')
  const [senderName, setSenderName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Fetch sender's ID and name from the API
  useEffect(() => {
    const fetchSenderInfo = async () => {
      const token = Cookies.get('access_token')
      if (!token) return

      try {
        const response = await axios.get('http://localhost:3000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSenderId(response.data.result._id)
        setSenderName(response.data.result.name)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    fetchSenderInfo()
  }, [])

  // Fetch messages when receiver changes
  useEffect(() => {
    const fetchMessages = async () => {
      const token = Cookies.get('access_token')
      if (!token) return

      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:3000/conversations/receivers/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: LIMIT, page: 1 }
        })
        setChatMessages(response.data.content || [])
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setLoading(false)
      }
    }

    if (receiverId) {
      fetchMessages()
    }
  }, [receiverId])

  // Socket event handlers
  useEffect(() => {
    socket.on('receive_message', (payload) => {
      setChatMessages((prev) => [...prev, payload])
      scrollToBottom()
    })

    return () => {
      socket.off('receive_message')
    }
  }, [])

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const conversation = {
      content: newMessage,
      sender_id: senderId,
      receiver_id: receiverId,
      sender_name: senderName,
      _id: new Date().getTime().toString()
    }

    socket.emit('send_message', { payload: conversation })
    setChatMessages((prev) => [...prev, conversation])
    setNewMessage('')
    scrollToBottom()
  }

  return (
    <div className={styles.ChatBox}>
      <div className={styles.ChatBox__body}>
        <p className={styles.ChatBox__name}>Chat with {receiverName}</p>
        <div className={styles.messagesContainer}>
          {loading ? (
            <p>Loading messages...</p>
          ) : (
            chatMessages.map((message, index) => (
              <div key={index} className={styles.message}>
                <div className={styles.message__Content}>{message.content}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
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
