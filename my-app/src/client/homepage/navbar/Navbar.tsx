import styles from './Navbar.module.scss'
import post from '../icon/post.svg'
import avatar from '../icon/avatar-default.png'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { RiTwitterXFill } from 'react-icons/ri'
import { IoMdHome, IoIosSettings } from 'react-icons/io'
import { GoHome, GoSearch } from 'react-icons/go'
import { FaRegBell, FaEnvelope, FaRegUser, FaList, FaUser, FaRegEnvelope, FaBell, FaSearch } from 'react-icons/fa'
import { LuMoreHorizontal } from 'react-icons/lu'
import { MdOutlineKeyboardVoice } from 'react-icons/md'
import Cookies from 'js-cookie'
import axios from 'axios'
import { toast } from 'react-toastify'

interface NavItem {
  path: string
  activeIcon: React.ReactNode
  inactiveIcon: React.ReactNode
  label: string
}
interface NavbarProps {
  userInfo: {
    name: string
    email: string
    avatar: string
  } | null
  onPostClick: () => void
}

export default function Navbar({ userInfo, onPostClick }: NavbarProps) {
  const navigate = useNavigate()
  const [moreItem, setMoreItem] = useState(false)
  const [showLogoutForm, setShowLogout] = useState(false)

  const logoutFormRef = useRef<HTMLDivElement>(null)
  const moreItemRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (logoutFormRef.current && !logoutFormRef.current.contains(event.target as Node)) {
      setShowLogout(false)
    }
    if (moreItemRef.current && !moreItemRef.current.contains(event.target as Node)) {
      setMoreItem(false)
    }
  }

  useEffect(() => {
    if (showLogoutForm || moreItem) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLogoutForm, moreItem])

  const handleLogout = async () => {
    try {
      const accessToken = Cookies.get('access_token')
      if (!accessToken) return

      const response = await axios.post(
        'http://localhost:3000/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      // Xóa accessToken khỏi cookie
      Cookies.remove('access_token')

      // Hiển thị thông báo thành công
      toast.success(response?.data?.message || 'Đăng xuất thành công')

      // Điều hướng đến trang đăng nhập
      navigate('/')
    } catch (error: any) {
      // Xử lý lỗi và hiển thị thông báo lỗi
      if (error.response) {
        const { errors } = error.response.data
        if (errors) {
          // Hiển thị thông báo lỗi cho từng trường cụ thể
          Object.keys(errors).forEach((key) => {
            const fieldError = errors[key]
            toast.error(fieldError.msg || 'Đã xảy ra lỗi')
          })
        } else {
          // Hiển thị thông báo lỗi chung
          toast.error(error.response.data.message || 'Có lỗi xảy ra khi đăng xuất')
        }
      } else {
        // Hiển thị thông báo lỗi kết nối hoặc lỗi khác
        toast.error('Đã xảy ra lỗi kết nối')
      }
    }
  }

  const ToggleMore = () => {
    setMoreItem(!moreItem)
  }

  const toggleLogout = () => {
    setShowLogout(!showLogoutForm)
  }
  const location = useLocation()
  const navItems: NavItem[] = [
    {
      path: '/home',
      activeIcon: <IoMdHome className={styles.navbar__icon} />,
      inactiveIcon: <GoHome className={styles.navbar__icon} />,
      label: 'Home'
    },
    {
      path: '/Explore',
      activeIcon: <FaSearch className={styles.navbar__icon} />,
      inactiveIcon: <GoSearch className={`${styles.navbar__icon} ${styles.inactive}`} />,
      label: 'Explore'
    },
    {
      path: '/Notifications',
      activeIcon: <FaBell className={styles.navbar__icon} />,
      inactiveIcon: <FaRegBell className={`${styles.navbar__icon} ${styles.inactive}`} />,
      label: 'Notifications'
    },
    {
      path: '/Message',
      activeIcon: <FaEnvelope className={styles.navbar__icon} />,
      inactiveIcon: <FaRegEnvelope className={`${styles.navbar__icon} ${styles.inactive}`} />,
      label: 'Message'
    },
    {
      path: '/Profile',
      activeIcon: <FaUser className={styles.navbar__icon} />,
      inactiveIcon: <FaRegUser className={`${styles.navbar__icon} ${styles.inactive}`} />,
      label: 'Profile'
    },
    {
      path: '',
      activeIcon: <LuMoreHorizontal className={styles.navbar__icon} />,
      inactiveIcon: <LuMoreHorizontal className={`${styles.navbar__icon} ${styles.inactive}`} />,
      label: 'More'
    }
  ]

  const navMoreItem: NavItem[] = [
    {
      path: '/List',
      activeIcon: <FaList className={styles.navbar__icon} />,
      inactiveIcon: <FaList className={`${styles.navbar__icon} ${styles.inactive}`} />,
      label: 'List'
    },
    {
      path: '/Setting',
      activeIcon: <IoIosSettings className={styles.navbar__icon} />,
      inactiveIcon: <IoIosSettings className={`${styles.navbar__icon} ${styles.inactive}`} />,
      label: 'Setting and privacy'
    },
    {
      path: '/Create',
      activeIcon: <MdOutlineKeyboardVoice className={styles.navbar__icon} />,
      inactiveIcon: <MdOutlineKeyboardVoice className={`${styles.navbar__icon} ${styles.inactive}`} />,
      label: 'Create your Space'
    }
  ]
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__list}>
        <div className={styles.navbar__icontitle}>
          <RiTwitterXFill className={styles.navbar__iconH} />
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={styles.navbar__item}
            onClick={item.label === 'More' ? ToggleMore : undefined}
          >
            {location.pathname === item.path ? item.activeIcon : item.inactiveIcon}
            <h2 className={styles.navbar__desc}>{item.label}</h2>
            {moreItem && (
              <div ref={moreItemRef} className={styles.navbar__moreList}>
                {navMoreItem.map((item) => (
                  <div className={styles.navbar__item}>
                    {location.pathname === item.path ? item.activeIcon : item.inactiveIcon}
                    <h2 className={styles.navbar__desc}>{item.label}</h2>
                  </div>
                ))}
              </div>
            )}
          </NavLink>
        ))}
        <button className={styles.navbar__button} onClick={onPostClick}>
          <img src={post} alt='Post' />
          <p>Post</p>
        </button>
        <div className={styles.navbar__user} onClick={toggleLogout}>
          <img src={userInfo?.avatar || avatar} className={styles.navbar__img} alt='User Avatar' />
          <div className={styles.navbar__userinfo}>
            {userInfo ? (
              <div className={styles.navbar__userinfo__text}>
                <p>{userInfo.name || 'Tên không có'}</p>
                <p>{userInfo.email || 'Email không có'}</p>
              </div>
            ) : (
              <p>Token hết hạn, vui lòng đăng nhập lại</p>
            )}
          </div>
          {showLogoutForm && (
            <div ref={logoutFormRef} className={styles.navbar__logoutForm}>
              <button className={styles.navbar__addaccount}>Add an existing account</button>
              <button className={styles.navbar__logout} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
