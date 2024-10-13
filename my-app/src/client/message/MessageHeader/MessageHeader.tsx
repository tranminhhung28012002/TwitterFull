import { IoSettingsOutline } from 'react-icons/io5'
import { TbMessagePlus } from 'react-icons/tb'
import styles from './MessageHeader.module.scss'
import { MdGroups2 } from 'react-icons/md'
import { FaSearch } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import axios from 'axios'
import Cookies from 'js-cookie'

interface ListMessage {
  _id: string
  email: string
  name: string
  userAvatar: string
}

export default function MessageHeader() {
  const [setting, setSetting] = useState<boolean>(false)
  const [AddMessage, setAddMessage] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [users, setUsers] = useState<ListMessage[]>([]) // Cập nhật kiểu dữ liệu cho người dùng

  const token = Cookies.get('access_token')

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get('http://localhost:3000/api/listUsers', {
          headers: {
            Authorization: `Bearer ${token}` // Sử dụng token để xác thực
          }
        })
        setUsers(data.result) // Lưu dữ liệu người dùng vào state
      } catch (error) {
        console.log('Error fetching users:', error)
      } finally {
        setLoading(false) // Kết thúc trạng thái loading
      }
    }
    fetchUsers()
  }, [token])

  const handleSetting = () => setSetting(!setting)
  const handleMessage = () => setAddMessage(!AddMessage)

  return (
    <>
      <div className={styles.MessageHeader}>
        <div className={styles.MessageHeader__title}>
          <p className={styles.MessageHeader__desc}>Messages</p>
          <div className={styles.MessageHeader__btn}>
            <IoSettingsOutline onClick={handleSetting} className={styles.MessageHeader__icon} />
            <TbMessagePlus onClick={handleMessage} className={styles.MessageHeader__icon} />
          </div>
        </div>

        {/* Hiển thị danh sách người dùng hoặc thông báo nếu chưa có */}
        {!loading && users.length > 0 ? (
          <div className={styles.MessageList}>
            {users.map((user) => (
              <div key={user._id} className={styles.MessageList__item}>
                <img src={user.userAvatar} alt={`${user.name}'s avatar`} className={styles.MessageList__avatar} />
                <div>
                  <p className={styles.MessageList__name}>{user.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.MessageHeader__content}>
            <h1 className={styles.MessageHeader__heading}>Welcome to your inbox!</h1>
            <p className={styles.MessageHeader__comment}>
              Drop a line, share posts and more with private conversations between you and others on X.
            </p>
            <button className={styles.MessageHeader__write} onClick={handleMessage}>
              Write a message
            </button>
          </div>
        )}
      </div>

      {AddMessage && (
        <div className={styles.show}>
          <div className={styles.MessageAdd}>
            <div className={styles.MessageAdd__Heading}>
              <IoMdClose className={styles.MessageAdd__icon} onClick={handleMessage} />
              <p className={styles.MessageAdd__desc}>New Message</p>
              <button className={styles.MessageAdd__btn}>Next</button>
            </div>
            <div className={styles.MessageAdd__Search}>
              <FaSearch className={styles.MessageAdd__icon__search} />
              <input className={styles.MessageAdd__add} type='text' placeholder='Search people' />
            </div>
            <div className={styles.MessageAdd__Group}>
              <MdGroups2 className={styles.MessageAdd__icon__Group} />
              <p>Create a group</p>
            </div>
            <div className={styles.MessageAdd__list}>
              {!loading && users.length > 0 ? (
                <div className={styles.MessageList}>
                  {users.map((user) => (
                    <div key={user._id} className={styles.MessageList__item}>
                      <img src={user.userAvatar} alt={`${user.name}'s avatar`} className={styles.MessageList__avatar} />
                      <div>
                        <p className={styles.MessageList__name}>{user.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.MessageHeader__content}></div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
