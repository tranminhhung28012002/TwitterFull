import { useState, useEffect, useRef } from "react";
import styles from "./MessageBody.module.scss";

export default function MessageBody() {
  const [messages, setMessages] = useState([
    { id: 1, text: "fasdfsadfas", time: "10:49 AM", seen: true },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:3000");
    socket.current.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        seen: false,
      };
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify(newMsg));
        setMessages((prevMessages) => [...prevMessages, newMsg]); // Thêm tin nhắn vào danh sách hiển thị ngay lập tức
      } else {
        console.error("WebSocket is not open. Cannot send message.");
      }

      setNewMessage("");
    }
  };
  return (
    <div className={styles.ChatBox}>
      <div className={styles.ChatBox__header}>
        <img
          src="https://via.placeholder.com/100"
          alt="avatar"
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <h3>Trần Minh Hưng</h3>
          <p>@TrnMinhHung2801</p>
          <p>Joined February 2024 · 21 Followers</p>
          <p>Not followed by anyone you’re following</p>
        </div>
      </div>
      <div className={styles.ChatBox__body}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className={styles.message}>
              <div className={styles.messageContent}>{message.text}</div>
              <div className={styles.messageInfo}>
                <span>{message.time}</span>
                {message.seen && <span> · Seen</span>}
              </div>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
      <div className={styles.ChatBox__input}>
        <input
          type="text"
          value={newMessage}
          placeholder="Start a new message"
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
