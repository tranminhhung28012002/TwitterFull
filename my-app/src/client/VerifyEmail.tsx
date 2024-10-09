import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQueryParams from './useQueryParams';
import axios from 'axios';

export default function VerifyEmail() {
  const [message, setMessage] = useState<string | null>(null);
  const { token } = useQueryParams();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    if (token) {
      axios
        .post('http://localhost:3000/api/verify-email',
          { email_verify_token: token },
          {
            signal: controller.signal,
          }     
        )
        .then((res) => {
          const successMessage = res.data.message;
          setMessage(successMessage);
          navigate('/', { state: { message: successMessage } }); // Chuyển hướng sang trang đăng nhập với thông báo
        })
        .catch((err) => {
          setMessage(err.response?.data?.message || 'Có lỗi xảy ra');
        });
    }

    return () => {
      controller.abort();
    };
  }, [token, navigate]);

  return <div>{message}</div>;
}
