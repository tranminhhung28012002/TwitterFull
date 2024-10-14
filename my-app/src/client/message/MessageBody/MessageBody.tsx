import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MessageBody.module.scss';
import socket from '../Socket/socket'; // Import the updated socket module

interface MessageBodyProps {
  receiver: string;
}

export default function MessageBody({ receiver }: MessageBodyProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (receiver) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/conversations/receivers/${receiver}`);
          setUserInfo(response.data);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };

      fetchUserInfo();

      socket.on('newMessage', (message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [receiver]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        content: newMessage,
        sender: localStorage.getItem('user_id'), // Replace with actual user ID
        receiver,
      };

      socket.emit('sendMessage', messageData);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <div className={styles.ChatBox}>
      <div className={styles.ChatBox__body}>
        <p className={styles.ChatBox__name}>Chat with {receiver}</p>
        <div className={styles.ChatBox__header}>
          {userInfo && (
            <>
              <img src={userInfo.avatar || 'https://via.placeholder.com/100'} alt='avatar' className={styles.avatar} />
              <div className={styles.userInfo}>
                <h3 className={styles.userInfo__name}>{userInfo.name || 'User Name'}</h3>
                <p className={styles.userInfo__name}>@{userInfo.email || 'email'}</p>
                <p className={styles.userInfo__date}>Joined {userInfo.joinedDate || 'Date'} · {userInfo.followers || 0} Followers</p>
                <p className={styles.userInfo__follow}>Not followed by anyone you’re following</p>
              </div>
            </>
          )}
        </div>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className={styles.message}>
              <div className={styles.messageContent}>{message}</div>
              <div className={styles.messageInfo}>
                <span>{message}</span>
                {message && <span> · Seen</span>}
              </div>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
      <div className={styles.ChatBox__input}>
        <input
          type='text'
          value={newMessage}
          placeholder='Start a new message'
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
