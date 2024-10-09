import React, { useEffect, useState } from 'react'
import styles from './Reply.module.scss'
import Mentions from '../Mentions'
import avatar from '../icon/avatar-default.png'
import Options from '../Options'

interface ReplyProps {
  ReplyRep: boolean
  onReply: () => void
}
export default function Reply({ ReplyRep, onReply }: ReplyProps) {
  const [userID, setUserID] = useState('0')
  const handleUserIDChange = (newUserID: string) => {
    setUserID(newUserID) // Nhận giá trị userID từ component Options
    console.log('Updated userID:', newUserID) //kiểm tra kết quả ở đây
  }
  const [reply, setReply] = useState('')
  const [comment, setComment] = useState<string[]>([])
  const handleReply = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReply(event.target.value)
  }

  //đổi const handletest thành onReply , nhớ sửa lại API r đổi
  const handletest = async () => {
    if (reply.trim() === ' ') {
      alert('vui long nhap ')
    }
    try {
      const response = await fetch('http:localhost:3000/api/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: reply })
      })
      if (response.ok) {
        const newReply = await response.json()
        setComment((prevReplies) => [...prevReplies, newReply.content])
        setReply('')
      }
      // } else {
      //   alert("Có lỗi xảy ra khi gửi phản hồi.");
      // }
    } catch (err) {
      console.error('loi tu API', err)
    }
  }
  const fetchComment = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/replies') // Đổi lại API
      const data = await response.json()
      // Cập nhật state với danh sách các phản hồi từ API
      setComment(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phản hồi:', error)
    }
  }
  useEffect(() => {
    fetchComment()
  }, [])
  return (
    <div className={styles.show}>
      <div className={styles.Container}>
        <div className='comment-list'>
          {comment.length > 0 ? (
            comment.map(
              (
                reply,
                index //map ra view
              ) => (
                <div key={index} className='comment-item'>
                  {reply}
                </div>
              )
            )
          ) : (
            <p>Chưa có phản hồi nào.</p>
          )}
        </div>
        <div className={styles.reply}>
          <div className={styles.reply__header}>
            <img src={avatar} alt='avatar user' className={styles.reply__avatar} />
          </div>
          <textarea
            className={styles.reply__textarea}
            placeholder='Post your reply'
            rows={3}
            value={reply}
            onChange={handleReply}
          />
        </div>
        <div className={styles.reply__button}>
          <Options onUserIDChange={handleUserIDChange} />
          <Mentions />
          <button className={styles.reply__btn} onClick={onReply}>
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}
