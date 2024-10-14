import { useEffect, useState } from 'react'
import Navbar from '../homepage/navbar'
import styles from './message.module.scss'
import MessageBody from './MessageBody'
import MessageHeader from './MessageHeader'
import Cookies from 'js-cookie'
import axios from 'axios'


export default function Message() {
  const [showPostForm, setShowPostForm] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showMessages, setShowMessages] = useState(false)

  const handlePostClick = () => setShowPostForm(true)
  const [receiver, setReceiver] = useState<string>(''); // Trạng thái để lưu userId của người nhận

  const handleUserClick = (userId: string) => {
    setReceiver(userId); // Cập nhật receiver khi click vào user
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = Cookies.get('access_token')
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
      <MessageBody receiver={receiver}/>
    </div>
  )
}
