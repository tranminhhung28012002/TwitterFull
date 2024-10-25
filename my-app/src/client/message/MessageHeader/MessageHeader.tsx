import { IoSettingsOutline } from 'react-icons/io5'
import { TbMessagePlus } from 'react-icons/tb'
import styles from './MessageHeader.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Message } from '../../../types'

interface User {
  _id: string
  email: string
  name: string
  avatar: string
}

interface UserWithMessages extends User {
  messages: Message[]
}

interface PropsClick {
  onClickMessage: (
    receiverId: string, // ID người dùng được chọn
    name: string,
    email: string,
    messages: Message[]
  ) => void
  senderId: string // ID của người dùng hiện tại
}

export default function MessageHeader({ onClickMessage, senderId }: PropsClick) {
  const [userList, setUserList] = useState<UserWithMessages[]>([])

  // Lấy danh sách người dùng khi component được mount
  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('access_token')
      if (!token) return

      try {
        const { data } = await axios.get('http://localhost:3000/api/listUsers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUserList(data.result) // Lưu danh sách người dùng vào state
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error)
      }
    }
    fetchUsers()
  }, [])

  // Xử lý khi người dùng nhấn vào một người dùng
  const handleUserClick = (user: UserWithMessages) => {
    onClickMessage(user._id, user.name, user.email, user.messages) // Gửi thông tin người dùng được chọn
    console.log('Sender Info:', senderId) // Kiểm tra senderId
    console.log('Receiver Info:', user._id) // Kiểm tra receiverId
  }

  return (
    <div className={styles.MessageHeader}>
      <div className={styles.MessageHeader__title}>
        <p className={styles.MessageHeader__desc}>Messages</p>
        <div className={styles.MessageHeader__btn}>
          <IoSettingsOutline className={styles.MessageHeader__icon} />
          <TbMessagePlus className={styles.MessageHeader__icon} />
        </div>
      </div>

      <div className={styles.MessageList}>
        {userList.map((user) => (
          <div
            key={user._id}
            className={styles.MessageList__item}
            onClick={() => handleUserClick(user)} // Gọi hàm khi nhấn vào người dùng
          >
            <img src={user.avatar} alt={`${user.name}'s avatar`} className={styles.MessageList__avatar} />
            <p className={styles.MessageList__name}>{user.name}</p>
          </div>
        ))}
      </div>

      <p className={styles.MessageHeader__comment}>
        Drop a line, share posts, and more with private conversations between you and others on X.
      </p>
    </div>
  )
}
