import { IoSettingsOutline } from 'react-icons/io5';
import { TbMessagePlus } from 'react-icons/tb';
import styles from './MessageHeader.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface ListMessage {
  _id: string;
  email: string;
  name: string;
  userAvatar: string;
}

interface PropsClick {
  onClickMessage: (userId: string) => void; // Cập nhật để nhận userId
}

export default function MessageHeader({ onClickMessage }: PropsClick) {
  const [users, setUsers] = useState<ListMessage[]>([]);
  const token = Cookies.get('access_token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/listUsers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(data.result);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [token]);

  const handleUserClick = (userId: string) => {
    onClickMessage(userId); // Truyền userId đến component cha
  };

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
        {users.map((user) => (
          <div key={user._id} className={styles.MessageList__item} onClick={() => handleUserClick(user._id)}>
            <img src={user.userAvatar} alt={`${user.name}'s avatar`} className={styles.MessageList__avatar} />
            <p className={styles.MessageList__name}>{user.name}</p>
          </div>
        ))}
      </div>
      <p className={styles.MessageHeader__comment}>
        Drop a line, share posts and more with private conversations between you and others on X.
      </p>
    </div>
  );
}