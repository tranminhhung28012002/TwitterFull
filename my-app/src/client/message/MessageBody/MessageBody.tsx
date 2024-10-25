import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import styles from './MessageBody.module.scss'
import socket from '../Socket/socket'
import Cookies from 'js-cookie'
import type { conversations } from '../../../types'

interface MessageBodyProps {
  receiverId: string
  receiverName: string
}

const LIMIT = 10

export function MessageBody({ receiverId, receiverName }: MessageBodyProps) {
  const [newMessage, setNewMessage] = useState<string>('')
  const [chatMessages, setChatMessages] = useState<conversations[]>([])
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
        setChatMessages(response.data.result.conversations)
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
    const handleMessageReceived = (payload: conversations) => {
      console.log('Received message payload:', payload)
      updateChatMessages(payload)
      scrollToBottom()
    }

    socket.on('receive_message', handleMessageReceived)
    socket.on('connect_error', (err) => console.log(err))
    socket.on('disconnect', (reason) => console.log(reason))

    return () => {
      socket.off('receive_message', handleMessageReceived)
    }
  }, [])

  const updateChatMessages = (message: conversations) => {
    setChatMessages((prev) => [...prev, message])
  }

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
    updateChatMessages(conversation)
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
          ) : chatMessages.length > 0 ? (
            chatMessages
              .filter(
                (conversation) =>
                  (conversation.sender_id === senderId && conversation.receiver_id === receiverId) ||
                  (conversation.sender_id === receiverId && conversation.receiver_id === senderId)
              )
              .map((conversation, index) => (
                <div key={index} className={styles.message}>
                  <div className={styles.message__Content}>
                    <strong>{conversation.sender_id === senderId ? senderName : receiverName}:</strong>
                    {conversation.content}
                  </div>
                </div>
              ))
          ) : (
            <p>No messages found.</p>
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
