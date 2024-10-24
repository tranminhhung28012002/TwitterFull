import { IoSettingsOutline } from 'react-icons/io5'
import { TbMessagePlus } from 'react-icons/tb'
import styles from './MessageHeader.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Message } from '../../../types' // Import the shared Message interface

interface User {
  _id: string
  email: string
  name: string
  avatar: string // Sửa từ userAvatar thành avatar
}

interface UserWithMessages extends User {
  messages: Message[]
}

interface PropsClick {
  onClickMessage: (userId: string, name: string, email: string, messages: Message[]) => void
}

export default function MessageHeader({ onClickMessage }: PropsClick) {
  const [userList, setUserList] = useState<UserWithMessages[]>([]) // Chỉnh lại kiểu dữ liệu theo userList
  const token = Cookies.get('access_token')

  // Lấy danh sách người dùng và các tin nhắn liên quan
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/listUsers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUserList(data.result) // Giả định `data.result` trả về danh sách người dùng và tin nhắn
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [token])
  // Khi người dùng được chọn
  const handleUserClick = (user: UserWithMessages) => {
    onClickMessage(user._id, user.name, user.email, user.messages)
    console.log('UserShow ', user._id)
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
            onClick={() => handleUserClick(user)} // Truyền cả đối tượng user
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
