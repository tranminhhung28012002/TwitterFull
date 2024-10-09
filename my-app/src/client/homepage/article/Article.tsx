import { useEffect, useRef, useState } from 'react'
import styles from './Article.module.scss'
import avatartest from '../icon/avatar-default.png'

import { GrView } from 'react-icons/gr'
import { FaRegCommentAlt, FaUndoAlt } from 'react-icons/fa'
import { BiLike } from 'react-icons/bi'
import { ObjectId } from 'mongodb'
import { Media } from '../../../../../src/Other'
import { TweetAudience, TweetType } from '../../../../../src/constants/enums'
import axios from 'axios'
import Reply from '../reply'
interface BlockProps {
  imageUserName: string
  userEmail: string
  name: string // đổi cho giống với API
  _id?: string // nhớ đổi lại object ID
  //bên phần giao diện tạo ra một interface chứa các trường như này để gửi về trong api
  user_id: ObjectId // lấy từ token
  type: TweetType //măc định để t gán
  audience: TweetAudience //chính là cái 0 1
  content: string
  parent_id: null | string //chỉ null khi tweet gốc
  hashtags: ObjectId[]
  mentions: string[] //là người mà bạn đề cập trong vòng bạn bè để có thể nhìn thấy tweets bạn đăng
  medias: Media[] //lấy tới chổ này
  reply: number
  repost: number
  like: number
  view: number
}

export default function Article() {
  const [replyActicle, setReplyActicle] = useState(false)
  const handleReply = () => {
    setReplyActicle(!replyActicle)
  }
  const [posts, setPosts] = useState<BlockProps[]>([]) // Sử dụng array với kiểu Post
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<BlockProps[]>('http://localhost:3001/api/status') // Lấy dữ liệu từ API và ép kiểu Post[] và nhớ đổi API
        setPosts(response.data) // Gán dữ liệu từ API vào state
        console.log(response.data) // Log dữ liệu để kiểm tra
        setLoading(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Đã xảy ra lỗi')
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) return <p>Đang tải dữ liệu...</p>
  if (error) return <p>Đã xảy ra lỗi khi tải dữ liệu: {error}</p>
  return (
    <div>
      <div className={styles.block}>
        <ul>
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <li className={styles.block__post} key={post._id}>
                <div className={styles.block__info}>
                  <h6 className={styles.block__name}>{post.name}</h6>
                  <p className={styles.block__userEmail}>{post.userEmail}</p>
                </div>
                <div>
                  <p className={styles.block__Status}>{post.content}</p>
                </div>
                <ul className={styles.block__Content}>
                  {post.reply !== undefined && (
                    <li className={styles.block__Content_reply} onClick={handleReply}>
                      <FaRegCommentAlt className={styles.icon} />
                      {post.reply}
                    </li>
                  )}
                  {post.repost !== undefined && (
                    <li className={styles.block__Content_undo}>
                      <FaUndoAlt className={styles.icon} />
                      {post.repost}
                    </li>
                  )}
                  {post.like !== undefined && (
                    <li className={styles.block__Content_like}>
                      <BiLike className={styles.icon} />
                      {post.like}
                    </li>
                  )}
                  {post.view !== undefined && (
                    <li className={styles.block__Content_view}>
                      <GrView className={styles.icon} />
                      {post.view}
                    </li>
                  )}
                </ul>
              </li>
            ))
          ) : (
            <p>Không có bài đăng nào để hiển thị.</p>
          )}
        </ul>

        {replyActicle && <Reply ReplyRep={replyActicle} onReply={() => setReplyActicle(false)} />}
      </div>
    </div>
  )
}
