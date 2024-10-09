import React, { useEffect, useState } from 'react';
import styles from './Slidebar.module.scss';
import search from '../icon/search.svg';
import avatar from '../icon/avatar-default.png';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
    _id: string;
    username: string;
    email: string;
    isFollowing: boolean;
}

export default function Slidebar() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const token = Cookies.get('access_token');
                const response = await fetch('http://localhost:3000/api/follow-list', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        getAllUsers();
    }, []);

    const handleFollow = async (userId: string) => {
        try {
            const token = Cookies.get('access_token');
            const response = await fetch('http://localhost:3000/api/follow', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ followed_user_id: userId }),
            });

            if (response.ok) {
                const data = await response.json();
                // Cập nhật trạng thái theo dõi cho người dùng
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, isFollowing: true } : user
                    )
                );
                toast.success(data.result.message); // Hiển thị thông báo thành công
            } else {
                console.error('Failed to follow user:', response.statusText);
                toast.error('Failed to follow the user.'); // Hiển thị thông báo lỗi
            }
        } catch (error) {
            console.error('Error following user:', error);
            toast.error('Error following the user.'); // Hiển thị thông báo lỗi
        }
    };

    return (
        <div className={styles.Slidebar}>
            <div className={styles.Slidebar__Search}>
                <img className={styles.Slidebar__iconSearch} src={search} alt="" />
                <input className={styles.Slidebar__Searchcmt} type="text" placeholder='Search' />
            </div>
            <div className={`${styles.Slidebar__Premium} ${styles.Slidebar__block}`}>
                <h2 className={styles.Slidebar__title}>Subscribe to Premium</h2>
                <p className={styles.Slidebar__desc}>Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
                <button className={styles.Slidebar__sub}>Subscribe</button>
            </div>
            {/* Đổ dữ liệu hastag + trending vào đây */}
            {/* ... */}
            {/* Đổ dữ liệu Follow vào đây */}
            <div className={`${styles.Slidebar__Wfollow} ${styles.Slidebar__block}`}>
                <h2 className={styles.Slidebar__title}>Who to follow</h2>
                {users.map((user, index) => (
                    <div key={index} className={styles.Slidebar__followUser}>
                        <div className={styles.Slidebar__user}>
                            <img className={styles.Slidebar__avatar} src={avatar} alt="#" />
                            <div>
                                <h3 className={styles.Slidebar__name}>{user.username}</h3>
                                <p className={styles.Slidebar__email}>{user.email}</p>
                            </div>
                        </div>
                        <button
                            className={styles.Slidebar__follow}
                            onClick={() => handleFollow(user._id)}
                            disabled={user.isFollowing} // Disable button if already following
                        >
                            {user.isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>
                ))}
                <a href="#" className={styles.Slidebar__Show}>Show more</a>
            </div>
            <ToastContainer /> {/* Thêm ToastContainer ở đây để hiển thị thông báo */}
        </div>
    );
}
