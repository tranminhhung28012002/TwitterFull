import { io } from 'socket.io-client';

// Hàm để tạo kết nối với server
const createSocketConnection = () => {
  const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
  console.log('Token retrieved:', token); // Log the token for debugging

  // Tạo kết nối với server tại http://localhost:3000 và gửi token qua 'auth'
  const socket = io('http://localhost:3000', {
    auth: {
      token: `Bearer ${token}`, // Gửi token JWT trong auth
    },
  });

  return socket;
};

// Xuất socket
const socket = createSocketConnection();
export default socket;
