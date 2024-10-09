import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQueryParams from './useQueryParams';
import axios from 'axios';

export default function VerifyForgotpassword() {
  const [message, setMessage] = useState<string | null>(null);
  const { token } = useQueryParams();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    if (token) {
      axios
        .post('http://localhost:3000/api/verify-forgot-password',
          { forgot_password_token: token },
          {
            signal: controller.signal,
          }
        )
        .then((res) => {
          const successMessage = res.data.message;
          setMessage(successMessage); 
          navigate('/resetpassword', { 
            state: { 
              message: successMessage,
              token
            } 
          }); 
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
