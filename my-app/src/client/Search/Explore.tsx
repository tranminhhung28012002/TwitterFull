import { useEffect, useState } from 'react'
import Navbar from '../homepage/navbar'
import Slidebar from '../homepage/slidebar'
import styles from './Search.module.scss'
import ExploreContent from './ExploreContent/ExploreContent'
import TrendingTopics from './TrendingTopics/TrendingTopics'
import ExploreSearch from './ExploreSearch/ExploreSearch'
import { useLocation } from 'react-router-dom'
import ExploreFilter from './SearchFilter/ExploreFilter' // Import ExploreFilter
import Cookies from 'js-cookie'
import axios from 'axios'

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  //lịch sử tìm kiếm
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [tweets] = useState<any[]>([])
  const [trending, setTrending] = useState<string>('Trending')
  const [selectedFilter, setSelectedFilter] = useState<string>('fromAnyone')
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  //tiêu đề mặc định khi vào trang tìm kiếm
  const topics = [
    { id: 1, title: 'For you' },
    { id: 2, title: 'Trending' },
    { id: 3, title: 'News' },
    { id: 4, title: 'Sport' },
    { id: 5, title: 'Entertainment' }
  ]
  //tiêu đề khi đã nhập và tìm kiếm
  const topicsEnter = [
    { id: 1, title: 'Top' },
    { id: 2, title: 'Latest' },
    { id: 3, title: 'People' },
    { id: 4, title: 'Media' },
    { id: 5, title: 'List' }
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setTrending('Top')
    setHasSearched(true)
  }
  //thằng này của navbar không cần quan tâm
  const handlePostClick = () => {
    console.log('Post clicked')
  }

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter) // Cập nhật bộ lọc đã chọn
    console.log('Selected filter:', filter) // Xử lý bộ lọc đã chọn
  }

  //này để chỉ hiện những phần cần thiết của slidebar đối với trang Search ( muốn hiện những gì thì qua slibar chỉnh)
  const location = useLocation()
  const isSearch = location.pathname.slice(1)
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
      <Navbar onPostClick={handlePostClick} userInfo={userInfo} />
      <div className={styles.explore}>
        {/* Phần nhập tìm kiếm */}
        <ExploreSearch
          onSearch={handleSearch}
          searchHistory={searchHistory}
          setSearchHistory={setSearchHistory}
          onBack={() => setTrending('Trending')}
        />
        {/* khi nhập tìm kiếm xong sẽ sang 1 trending khác , trở về sẽ về lại trending ban đầu */}
        <TrendingTopics topics={trending === 'Top' ? topicsEnter : topics} />
        {/* trả về kết quả khi search hoặc bấm vào mục lục */}
        <ExploreContent searchQuery={searchQuery} tweets={tweets} loading={loading} selectedFilter={selectedFilter} />
      </div>
      <div>
        {/* bộ lọc search */}
        {hasSearched && <ExploreFilter onFilterChange={handleFilterChange} selectedFilter={selectedFilter} />}
        <Slidebar />
      </div>
    </div>
  )
}
