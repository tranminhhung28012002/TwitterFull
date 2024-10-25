import { useEffect, useState } from 'react'
import Navbar from '../homepage/navbar'
import styles from './message.module.scss'
import MessageBody from './MessageBody'
import MessageHeader from './MessageHeader'
import Cookies from 'js-cookie'
import axios from 'axios'
import type { Message } from '../../types'

const LIMIT = 10

export default function Message() {
  const [showPostForm, setShowPostForm] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState([]) // Danh sách cuộc hội thoại
  const [receiverId, setReceiverId] = useState<string>('') // ID của người nhận
  const [receiverName, setReceiverName] = useState<string>('') // Tên người nhận
  const [senderId, setSenderId] = useState<string>('') // Thêm state cho senderId

  // Lấy thông tin người dùng đăng nhập
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get('access_token')
      if (!token) return // Nếu không có token thì dừng
      try {
        const response = await axios.get('http://localhost:3000/api/me', {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        })
        const { result } = response.data
        setUserInfo(result) // Lưu thông tin người dùng
        setSenderId(result._id) // Lưu ID người gửi
        console.log('Thông tin người dùng:', result)
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error)
      } finally {
        setLoading(false) // Đặt trạng thái loading thành false sau khi hoàn thành
      }
    }

    fetchUserInfo()
  }, [])

  const handlePostClick = () => setShowPostForm(true)

  // Xử lý khi người dùng nhấn vào một cuộc hội thoại
  const handleUserClick = (receiverId: string, name: string) => {
    setReceiverId(receiverId)
    setReceiverName(name)
  }

  if (loading) return <div>Loading...</div> // Hiển thị loading nếu đang tải

  return (
    <div className={styles.Container}>
      <Navbar onPostClick={handlePostClick} userInfo={userInfo} />
      <MessageHeader onClickMessage={handleUserClick} senderId={senderId} /> {/* Truyền senderId vào đây */}
      {receiverId ? (
        <MessageBody receiverId={receiverId} receiverName={receiverName} />
      ) : (
        <p className={styles.NoConversation}>Please select a conversation to start chatting.</p>
      )}
    </div>
  )
}
