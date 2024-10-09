import React, { useEffect, useState } from 'react';
import styles from './checkmail.module.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import useQueryParams from '../useQueryParams';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState(''); 
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Thay đổi URL thành API của bạn để gửi email quên mật khẩu
            const result = await axios.post('http://localhost:3000/api/resend-forgot-password', {email} );       
            toast.success(result.data.message);
        } catch (error) {
            toast.error('Đã xảy ra lỗi. Vui lòng kiểm tra email của bạn.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.forgotPasswordContainer}>
            <div className={styles.forgotPassword}>
                <p>Forgot Password Component Loaded</p>
                <h2>Quên mật khẩu</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Nhập địa chỉ email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại mật khẩu'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
