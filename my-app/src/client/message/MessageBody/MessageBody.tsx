import { useState, useEffect, useRef } from 'react'
import styles from './MessageBody.module.scss'

interface UserChat {
  name: string
  email: string
}

export default function MessageBody() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const socket = useRef<WebSocket | null>(null)

  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:3000/Message')
    socket.current.onopen = () => {
      console.log('WebSocket connection established.')
    }

    socket.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data)
      setMessages([])
    }

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      socket.current?.close()
    }
  }, []) // đổi lại API socket

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        seen: false
      }
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify(newMsg))
        setMessages((prevMessages) => []) // Thêm tin nhắn vào danh sách hiển thị ngay lập tức
      } else {
        console.error('WebSocket is not open. Cannot send message.')
      }

      setNewMessage('')
    }
  }
  return (
    <div className={styles.ChatBox}>
      <div className={styles.ChatBox__body}>
        <p className={styles.ChatBox__name}>Name</p>
        <div className={styles.ChatBox__header}>
          <img src='https://via.placeholder.com/100' alt='avatar' className={styles.avatar} />
          <div className={styles.userInfo}>
            <h3>Trần Minh Hưng</h3>
            <p className={styles.userInfo__name}>@TrnMinhHung2801</p>
            <p className={styles.userInfo__date}>Joined February 2024 · 21 Followers</p>
            <p className={styles.userInfo__follow}>Not followed by anyone you’re following</p>
          </div>
        </div>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message} className={styles.message}>
              <div className={styles.messageContent}>{message}</div>
              <div className={styles.messageInfo}>
                <span>{message}</span>
                {message && <span> · Seen</span>}
              </div>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
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

      {/* <div>
        <h1>Select a message</h1>
        <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
        <button>New Message</button>
      </div> */}
    </div>
  )
}
