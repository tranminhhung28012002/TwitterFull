import { useState, useEffect } from 'react'
import styles from './profile.module.scss'

import { useNavigate, useParams } from 'react-router-dom'
import { FaCalendarAlt, FaMapMarkerAlt, FaLink, FaTimes, FaCamera } from 'react-icons/fa'
import Navbar from '../homepage/navbar'
import Slidebar from '../homepage/slidebar'
import avatar from '../homepage/icon/avatar-default.png'
import { IoMdArrowRoundBack } from 'react-icons/io'
import Cookies from 'js-cookie'
import axios from 'axios'
interface UserProfile {
  id: string
  name: string
  username: string
  website: string
  joinDate: string
  followersCount: number
  followingCount: number
  avatarUrl: string
  bannerUrl: string
  bio: string
  location: string
  birthDate: string
}
interface EditedProfile {
  bio: string
  location: string
  birthDate: string
  name: string
}

export default function Profile() {
  //phần này đưa data vào
  //-------NOTE--------
  // useEffect(() => {
  //     // ... existing useEffect for fetching profile
  //   }, [username]);

  //   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
  //     const file = e.target.files?.[0];
  //     if (!file) return;

  //     const formData = new FormData();
  //     formData.append(type, file);

  //     try {
  //       const response = await http.post(`/users/${type}`, formData, {
  //         headers: { 'Content-Type': 'multipart/form-data' }
  //       });

  //       if (response.data.success) {
  //         setProfile(prev => {
  //           if (!prev) return null;
  //           return {
  //             ...prev,
  //             [type === 'avatar' ? 'avatarUrl' : 'bannerUrl']: response.data.url
  //           };
  //         });
  //         alert(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
  //       } else {
  //         alert(`Failed to update ${type}. Please try again.`);
  //       }
  //     } catch (error) {
  //       console.error(`Error uploading ${type}:`, error);
  //       alert(`An error occurred while uploading ${type}. Please try again.`);
  //     }
  //   };

  //   const handleInputChange = (field: keyof EditedProfile, value: string) => {
  //     setEditedProfile(prev => ({ ...prev, [field]: value }));
  //   };

  //   const handleSave = async () => {
  //     try {
  //       const response = await http.put(`/users/${profile?.id}`, editedProfile);
  //       if (response.data.success) {
  //         setProfile(prev => ({ ...prev, ...editedProfile } as UserProfile));
  //         alert('Profile updated successfully!');
  //       } else {
  //         alert('Failed to update profile. Please try again.');
  //       }
  //     } catch (error) {
  //       console.error('Error updating profile:', error);
  //       alert('An error occurred while updating profile. Please try again.');
  //     }
  //   };

  //   const handleClose = () => {
  //     // Reset edited profile or close edit mode
  //     setEditedProfile({
  //       bio: profile?.bio || '',
  //       location: profile?.location || '',
  //       birthDate: '', // Assuming birthDate is not in the original profile
  //       name: profile?.name || ''
  //     });
  //   };

  //   if (!profile) {
  //     return <div>Loading...</div>;
  //   }

  //-------NOTE-------
  //phần này fake data để custom giao diện
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'tran hung',
    username: 'tranhung18h03',
    website: 'https://example.com',
    joinDate: 'February 2024',
    followersCount: 4,
    followingCount: 5,
    avatarUrl: avatar,
    bannerUrl: 'https://example.com/banner.jpg',
    bio: '',
    location: '',
    birthDate: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [activeTab, setActiveTab] = useState('posts')
  const navigate = useNavigate()

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedProfile((prev) => ({
          ...prev,
          [type === 'avatar' ? 'avatarUrl' : 'bannerUrl']: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }
  //t tự thêm vào lấy từ homepage sang
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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

  return (
    <div className={styles.container}>
      <Navbar onPostClick={() => {}} userInfo={userInfo} />
      <div className={styles.profile}>
        <div className={styles.profile__header}>
          <IoMdArrowRoundBack className={styles.profile__backIcon} onClick={() => navigate(-1)} />
          <div>
            <h2 className={styles['profile__header-name']}>{profile.name}</h2>
            <span className={styles.profile__post}>1 post</span>
          </div>
        </div>

        {isEditing ? (
          <div className={styles.show}>
            <div className={styles.editProfile}>
              <div className={styles.editHeader}>
                <FaTimes onClick={() => setIsEditing(false)} className={styles.closeIcon} />
                <div>
                  <h2>Edit profile</h2>
                  <button onClick={handleSave} className={styles.saveButton}>
                    Save
                  </button>
                </div>
              </div>
              <div className={styles.editBanner}>
                <img src={editedProfile.bannerUrl} className={styles.editBanner__Img} />
                <label className={styles.editBannerButton}>
                  <FaCamera />
                  <input type='file' accept='image/*' onChange={(e) => handleFileChange(e, 'banner')} />
                </label>
              </div>
              <div className={styles.editAvatar}>
                <img src={editedProfile.avatarUrl} alt='Avatar' />
                <label className={styles.editAvatarButton}>
                  <FaCamera />
                  <input type='file' accept='image/*' onChange={(e) => handleFileChange(e, 'avatar')} />
                </label>
              </div>
              <div className={styles.editForm}>
                <input
                  type='text'
                  value={editedProfile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder='Name'
                />
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder='Bio'
                />
                <input
                  type='text'
                  value={editedProfile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder='Location'
                />
                <input
                  type='text'
                  value={editedProfile.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder='Website'
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.profile__banner}>
              <img src={profile.bannerUrl} />
            </div>
            <div className={styles.profile__info}>
              <img src={profile.avatarUrl} alt='Avatar' className={styles.profile__avatar} />
              <button onClick={() => setIsEditing(true)} className={styles.editButton}>
                Edit profile
              </button>
              <h1 className={styles.profile__name}>{profile.name}</h1>
              <p className={styles.profile__username}>@{profile.username}</p>
              {profile.bio && <p className={styles.profile__bio}>{profile.bio}</p>}
              <div className={styles.profile__details}>
                {profile.location && (
                  <span>
                    <FaMapMarkerAlt /> {profile.location}
                  </span>
                )}
                {profile.website && (
                  <span>
                    <FaLink /> <a href={profile.website}>{profile.website}</a>
                  </span>
                )}
                <span>
                  <FaCalendarAlt /> Joined {profile.joinDate}
                </span>
              </div>
              <div className={styles.profile__followCounts}>
                <span>
                  <strong>{profile.followingCount}</strong> Following
                </span>
                <span>
                  <strong>{profile.followersCount}</strong> Followers
                </span>
              </div>
            </div>
          </>
        )}

        <div className={styles.profile__tabs}>
          {['Posts', 'Replies', 'Highlights', 'Media', 'Likes'].map((tab) => (
            <button
              key={tab}
              className={`${styles.profile__tab} ${activeTab === tab.toLowerCase() ? styles['profile__tab--active'] : ''}`}
              onClick={() => {
                console.log(tab)
                setActiveTab(tab.toLowerCase())
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className={styles.profile__content}>
          {/* Content based on active tab */}
          <div>Content for {activeTab}</div>
        </div>
      </div>
      <Slidebar />
    </div>
  )
}
