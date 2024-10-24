import { useEffect, useState } from 'react'
import Navbar from '../homepage/navbar'
import styles from './message.module.scss'
import MessageBody from './MessageBody'
import MessageHeader from './MessageHeader'
import Cookies from 'js-cookie'
import axios from 'axios'
import type { Message } from '../../types' // Import the shared Message interface

export default function Message() {
  const [showPostForm, setShowPostForm] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [receiverId, setReceiverId] = useState<string>('') // Lưu userId của người nhận
  const [receiverName, setReceiverName] = useState<string>('') // Lưu tên người nhận
  const [messages, setMessages] = useState<Message[]>([]) // Lưu danh sách tin nhắn

  const handlePostClick = () => setShowPostForm(true)

  const handleUserClick = async (userId: string, userName: string) => {
    setReceiverId(userId)
    setReceiverName(userName)
    setMessages([]) // Xóa tin nhắn cũ trước khi tải tin nhắn mới
    const token = Cookies.get('access_token')
    try {
      const response = await axios.get(`http://localhost:3000/conversations/receivers/${userId}?limit=10&page=1`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(response.data.messages.map((msg: Message) => msg.content))
      // Cập nhật tin nhắn từ API
    } catch (error) {
      console.error('Lỗi khi tải tin nhắn:', error)
    }
    console.log('MessageHeader keo qua ', userId)
  }

  // Lấy thông tin người dùng đăng nhập
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get('access_token')
      try {
        if (!token) return
        const response = await axios.get('http://localhost:3000/api/me', {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        })
        const { result } = response.data
        setUserInfo(result)
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserInfo()
  }, [])
  if (loading) return <div>Loading...</div>

  return (
    <div className={styles.Container}>
      <Navbar onPostClick={handlePostClick} userInfo={userInfo} />
      <MessageHeader onClickMessage={handleUserClick} />
      {receiverId ? (
        <MessageBody receiverId={receiverId} receiverName={receiverName} messages={messages} />
      ) : (
        <p className={styles.NoConversation}>Please select a conversation to start chatting.</p>
      )}
    </div>
  )
}
