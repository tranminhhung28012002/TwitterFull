import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './Homepage.module.scss'
import Navbar from './navbar'
import Slidebar from './slidebar'
import avatar from './icon/avatar-default.png'
import earth from './icon/earth.svg'
import AutoResizeTextarea from './AutoResizeTextarea/Textarea'
import { FaList } from 'react-icons/fa'
import { MdInsertEmoticon, MdDateRange, MdOutlineGifBox } from 'react-icons/md'
import { IoLocationOutline } from 'react-icons/io5'
import { CiImageOn } from 'react-icons/ci'
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Hastag from './hastag'
import { Media } from '../../../../src/Other'
import { TweetAudience, TweetType } from '../../../../src/constants/enums'
import Options from './Options'

interface Post {
  _id: string
  user_id: string // lấy từ token
  type: string //măc định để t gán
  audience: string //chính là cái 0 1
  content: string
  parent_id: null | string //chỉ null khi tweet gốc
  hashtags: string
  mentions: string[] //là người mà bạn đề cập trong vòng bạn bè để có thể nhìn thấy tweets bạn đăng
  medias: Media[] //lấy tới chổ này
}
export default function Homepage() {
  const [activeTab, setActiveTab] = useState('forYou')
  const [text, setText] = useState<string>('')
  const [modalText, setModalText] = useState<string>('')
  const [userHastag, setUserHastag] = useState<string>('')
  const [showPostForm, setShowPostForm] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImages, setSelectedImages] = useState<File[]>([]) // Chứa nhiều ảnh
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]) // Chứa nhiều video
  const [videoUrls, setVideoUrls] = useState<string[]>([]) // Chứa các URL video đã upload
  const [userID, setUserID] = useState('0') // mặc định chưa chỉnh public hoặc chỉ những người theo dõi, thì trả về id = 0"
  const handleUserIDChange = (newUserID: string) => {
    setUserID(newUserID) // Nhận giá trị userID từ component Options
    console.log('Updated userID:', newUserID) //kiểm tra kết quả ở đây
  }
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }

  const handleFormchange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setModalText(event.target.value)
  }

  const handlePostClick = () => {
    setShowPostForm(true)
  }

  const handleClose = () => {
    setShowPostForm(false)
    setModalText('')
    setSelectedImages([]) // Xóa các ảnh đã chọn
  }

  const handleSubmitPost = async () => {
    if ((text || modalText) && userHastag) {
      const newPost: Post = {
        _id: '123', // Backend sẽ cấp ID nếu cần
        user_id: '12321412421421', // Sửa theo logic lấy từ token
        audience: userID === '0' ? '0' : '1',
        content: text || modalText,
        parent_id: '1', // Null nếu là bài gốc
        hashtags: userHastag,
        mentions: ['1231231231231'], // Danh sách ID người được nhắc đến
        medias: [],
        type: '123424'
      }

      try {
        const response = await fetch('http://localhost:3001/api/tweets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newPost)
        })

        if (response.ok) {
          const result = await response.json()
          console.log('Đăng bài thành công:', result)
          setText('')
          setModalText('')
        } else {
          console.error('Lỗi khi đăng bài:', response.statusText)
          alert('Đã xảy ra lỗi khi đăng bài!')
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error)
        alert('Không thể kết nối đến máy chủ!')
      }
    } else {
      alert('Vui lòng thêm nội dung hoặc chọn một hình ảnh!')
    }
    handleClose()
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setSelectedImages(Array.from(files)) // Lưu nhiều ảnh vào state
    }
    // Reset lại giá trị của input để cho phép chọn lại ảnh khác ngay sau đó
    event.target.value = ''
  }
  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setSelectedVideos(Array.from(files)) // Lưu nhiều video vào state
    }
    // Reset lại giá trị của input để cho phép chọn lại video khác ngay sau đó
    event.target.value = ''
  }
  const handleCreateTweet = async () => {
    // Kết hợp imageUrls và videoUrls thành một mảng 'mediaUrls'
    const mediaUrls = [...imageUrls, ...videoUrls]
    console.log('url', mediaUrls)
    // Tạo body cho request API
    const tweetData = {
      content: 'Nội dung tweet của bạn', // Thay bằng nội dung thực tế
      medias: mediaUrls // Mảng chứa các URL hình ảnh và video
    }

    try {
      // Gửi request đến API tạo tweet
      const response = await fetch('http://localhost:3000/tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tweetData)
      })

      const data = await response.json()
      console.log('Tweet created:', data)
    } catch (error) {
      console.error('Error creating tweet:', error)
    }
  }
  // Hàm xử lý upload video lên server
  const handleVideoUpload = async () => {
    try {
      const token = Cookies.get('access_token')
      if (!token) {
        toast.error('No token found')
        return
      }
      const formData = new FormData()
      formData.append('text', modalText)
      selectedVideos.forEach((video) => {
        formData.append('video', video) // Thêm video vào form data
      })

      const response = await axios.post('http://localhost:3000/media/upload-Video', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      const { message, result } = response.data
      if (Array.isArray(result) && result.length > 0) {
        const uploadedVideoUrls = result.map((vid: { url: string }) => vid.url)
        setVideoUrls((prev) => [...prev, ...uploadedVideoUrls])
      }
      toast.success(message)
      handleClose()

      setSelectedVideos([]) // Reset lại danh sách video sau khi upload
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Lỗi khi upload video:', error.response?.data || error.message)
      } else {
        console.error('Lỗi không phải Axios:', error)
      }
      toast.error('Failed to upload video. Please try again.')
    }
  }

  const handlePost = async () => {
    try {
      const token = Cookies.get('access_token')
      console.log(token)
      if (!token) {
        toast.error('No token found')
        return
      }
      const formData = new FormData()
      formData.append('text', modalText)
      selectedImages.forEach((image) => {
        formData.append('image', image)
      })

      const response = await axios.post('http://localhost:3000/media/upload-Image', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
      const { message, result } = response.data
      if (Array.isArray(result) && result.length > 0) {
        const uploadedImageUrls = result.map((img: { url: string }) => img.url)
        setImageUrls((prev) => [...prev, ...uploadedImageUrls])
      }
      toast.success(message)
      handleClose()

      // Reset lại input file và state selectedImages
      setSelectedImages([])

      const imageUploadModal = document.getElementById('imageUploadModal') as HTMLInputElement
      const imageUpload = document.getElementById('imageUpload') as HTMLInputElement

      if (imageUploadModal) {
        imageUploadModal.value = '' // Reset input file modal
      } else {
        console.warn('Không tìm thấy phần tử với id "imageUploadModal"')
      }

      if (imageUpload) {
        imageUpload.value = '' // Reset input file trong post form chính
      } else {
        console.warn('Không tìm thấy phần tử với id "imageUpload"')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Lỗi khi đăng bài:', error.response?.data || error.message)
      } else {
        console.error('Lỗi không phải Axios:', error)
      }
      toast.error('Failed to upload post. Please try again.')
    }
  }
  const handlePostAndUpload = () => {
    handleSubmitPost()
    handlePost()
    handleVideoUpload()
    handleCreateTweet()
  }

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

  useEffect(() => {
    if (!toast.isActive(13)) {
      console.log('first time running')
      toast.error('User does not exist', {
        position: 'bottom-right',
        autoClose: false,
        closeOnClick: true,
        draggable: false,
        toastId: 13
      })
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.HomepageContainer}>
      <Navbar onPostClick={handlePostClick} userInfo={userInfo} />
      <div className={styles.Homepage}>
        <div className={styles.Homepage__header}>
          <div
            className={`${styles.Homepage__act1} ${activeTab === 'forYou' ? styles.active : ''}`}
            onClick={() => setActiveTab('forYou')}
          >
            <h3 className={styles.Homepage__title}>For you</h3>
          </div>
          <div
            className={`${styles.Homepage__act2} ${activeTab === 'following' ? styles.active : ''}`}
            onClick={() => setActiveTab('following')}
          >
            <h3 className={styles.Homepage__title}>Following</h3>
          </div>
        </div>
        <div className={styles.Homepage__content}>
          <div className={styles.Homepage__post}>
            <img src={avatar} alt='Avatar' className={styles.Homepage__avatar} />
            <div className={styles.Homepage__postbtn}>
              <AutoResizeTextarea value={text} onChange={handleChange} placeholder='What is happening' />
              <Hastag
                value={userHastag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserHastag(e.target.value)}
              />

              {/* đổi lại ở đây gọi callback để lấy userID từ component Options về homepage*/}
              <Options onUserIDChange={handleUserIDChange} />

              <div className={styles.Homepage__toolbar}>
                <ul className={styles.Homepage__list}>
                  <li>
                    <label htmlFor='imageUpload' className={styles.Homepage__item}>
                      <CiImageOn />
                      <input
                        type='file'
                        id='imageUpload'
                        className={styles.fileInput}
                        onChange={handleImageChange}
                        multiple // Cho phép chọn nhiều ảnh
                      />
                    </label>
                  </li>
                  {/* Input chọn video */}
                  <li>
                    <label htmlFor='videoUpload' className={styles.Homepage__item}>
                      <CiImageOn /> {/* Icon có thể thay đổi */}
                      <input
                        type='file'
                        id='videoUpload'
                        className={styles.fileInput}
                        onChange={handleVideoChange}
                        multiple
                        accept='video/*'
                      />
                    </label>
                  </li>
                  <li>
                    <MdOutlineGifBox className={styles.Homepage__item} />
                  </li>
                  <li>
                    <FaList className={styles.Homepage__item} />
                  </li>
                  <li>
                    <MdInsertEmoticon className={styles.Homepage__item} />
                  </li>
                  <li>
                    <MdDateRange className={styles.Homepage__item} />
                  </li>
                  <li>
                    <IoLocationOutline className={styles.Homepage__item} />
                  </li>
                </ul>
                <button className={styles.Homepage__btn} onClick={handlePostAndUpload}>
                  Post
                </button>
              </div>
            </div>
          </div>

          {showPostForm && (
            <div className={styles.show}>
              <div className={`${styles.Homepage__postForm}`}>
                <div className={styles.Homepage__postbtn}>
                  <a className={styles.Homepage__postClose} href='/' onClick={handleClose}>
                    X
                  </a>
                  <div className={styles.Homepage__postInfo}>
                    <img src={avatar} alt='Avatar' className={styles.Homepage__avatar} />
                    <AutoResizeTextarea value={modalText} onChange={handleFormchange} placeholder='What is happening' />
                  </div>
                  <div className={styles.Homepage__every}>
                    <img src={earth} alt='Earth' />
                    <p className={styles.Homepage__every__reply}>Everyone can reply</p>
                  </div>
                  <div className={styles.Homepage__toolbar}>
                    <ul className={styles.Homepage__list}>
                      <li>
                        <label htmlFor='imageUploadModal' className={styles.Homepage__item}>
                          <CiImageOn />
                          <input
                            type='file'
                            id='imageUploadModal'
                            className={styles.fileInput}
                            onChange={handleImageChange}
                            multiple
                          />
                        </label>
                      </li>
                      <li>
                        <MdOutlineGifBox className={styles.Homepage__item} />
                      </li>
                      <li>
                        <FaList className={styles.Homepage__item} />
                      </li>
                      <li>
                        <MdInsertEmoticon className={styles.Homepage__item} />
                      </li>
                      <li>
                        <MdDateRange className={styles.Homepage__item} />
                      </li>
                      <li>
                        <IoLocationOutline className={styles.Homepage__item} />
                      </li>
                    </ul>
                    <button className={styles.Homepage__btn} onClick={handlePostAndUpload}>
                      Post
                    </button>

                    {/* <Article 
                                          id='123'
                                          name='asd'
                                          userEmail ='sadfwec'    
                                          status = 'fsadfsdfwecfwdfascfc'    
                                          imageUrl={sad}
                                          reply={3}
                                          like={5}
                                          view={100}
                                          repost={50}
                                          imageUserName={avatar}
                                          /> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.imageGallery}>
          {imageUrls.length > 0 &&
            imageUrls.map((url, index) => (
              <div key={index} className={styles.imageContainer}>
                <img src={url} alt={`Uploaded ${index}`} className={styles.uploadedImage} />
              </div>
            ))}
        </div>
        <div className={styles.videoGallery}>
          {videoUrls.length > 0 &&
            videoUrls.map((url, index) => (
              <div key={index} className={styles.videoContainer}>
                <video controls className={styles.uploadedVideo}>
                  <source src={url} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
        </div>
      </div>
      <ToastContainer containerId={'friendRequest'} />
      <Slidebar />
    </div>
  )
}
