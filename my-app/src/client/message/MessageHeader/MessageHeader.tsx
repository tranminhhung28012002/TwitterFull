import { IoSettingsOutline } from 'react-icons/io5'
import { TbMessagePlus } from 'react-icons/tb'
import styles from './MessageHeader.module.scss'
import { MdGroups2 } from 'react-icons/md'
import { FaSearch } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import axios from 'axios'
import Cookies from 'js-cookie'

//đổi hết lại kiểu dữ liệu
interface ListMessage {
  _id: string
  sender_id: string
  content: string
  receiver_id: string
}

export default function MessageHeader() {
  const [setting, setSetting] = useState<boolean>(false)
  const handleSetting = () => {
    setSetting(!setting)
  }
  const [AddMessage, setAddMessage] = useState(false)
  const handleMessage = () => {
    setAddMessage(!AddMessage)
  }
  const [loading, setLoading] = useState<boolean>(true)
  const [showListMessage, setShowListMessage] = useState<ListMessage[]>([])
  const token = Cookies.get('access_token')
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:3001/api/listUsers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setShowListMessage(response.data) // Lưu dữ liệu vào trạng thái
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
      } finally {
        setLoading(false) // Kết thúc loading
      }
    }
    fetchMessages()
  }, [])
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
        {showListMessage.length === 0 ? (
          <div className={styles.MessageHeader__content}>
            <h1 className={styles.MessageHeader__heading}>Welcome to your inbox!</h1>
            <p className={styles.MessageHeader__comment}>
              Drop a line, share posts and more with private conversations between you and others on X.{' '}
            </p>
            <button className={styles.MessageHeader__write} onClick={handleMessage}>
              Write a message
            </button>
          </div>
        ) : (
          <div className={styles.MessageList}>
            {showListMessage.map((message) => (
              <div key={message._id} className={styles.MessageList__item}>
                <span className={styles.MessageList__name}>{message._id}</span>
                <p className={styles.MessageList__chat}>{message.content}</p>
              </div>
            ))}
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
          </div>
        </div>
      )}
    </>
  )
}
