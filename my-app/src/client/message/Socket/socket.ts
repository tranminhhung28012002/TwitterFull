import io from 'socket.io-client';

// Tạo kết nối với server tại http://localhost:3000 và gửi token qua 'auth'
const socket = io('http://localhost:3001', {  
  auth: { 
    token: `Bearer ${localStorage.getItem('access_token')}`  // Gửi token JWT trong auth
  }
});

export default socket;
