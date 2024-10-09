import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './Register.module.scss';
import btn from '../login/button.module.scss';
import twitter from '../login/img/twitter.jpg';
import { toast } from 'react-toastify';
import axios from 'axios';

interface RegisterProps {
  showRegister: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
}

export default function Register({ showRegister, onClose }: RegisterProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // Gửi request đăng ký đến server
      const response = await axios.post('http://localhost:3000/api/register', data, {
        withCredentials: true
      });
     console.log(response)
      // Hiển thị thông báo thành công
      toast.success(response.data.message || 'Đăng ký thành công');

      // Đóng modal sau khi đăng ký thành công
      onClose();
    } catch (error: any) {
      // Xử lý lỗi
      if (error.response) {
        // Kiểm tra nếu có lỗi cụ thể từ máy chủ
        const { errors } = error.response.data;
        if (errors) {
          // Hiển thị thông báo lỗi cho từng trường cụ thể
          Object.keys(errors).forEach((key) => {
            const fieldError = errors[key];
            toast.error(fieldError.msg || 'Đã xảy ra lỗi');
          });
        } else {
          // Hiển thị thông báo lỗi chung
          toast.error(error.response.data.message || 'Đã xảy ra lỗi');
        }
      } else {
        // Hiển thị thông báo lỗi kết nối hoặc lỗi khác
        toast.error('Đã xảy ra lỗi kết nối');
      }
    }
  };

  if (!showRegister) return null;

  return (
    <div className={`${styles.twitterRegister} ${styles.show}`}>
      <div className={styles.twitterRegister__block}>
        {/* Block create : email, tên, ngày sinh, mật khẩu */}
        <a className={styles.twitterRegister__close} onClick={onClose}>X</a>
        <img src={twitter} className={styles.twitterRegister__icon} alt="Twitter Icon" />
        <h2 className={`${styles.twitterRegister__heading} ${styles['twitterRegister__heading-mb33']}`}>Tạo tài khoản của bạn</h2>  
        <form className={styles.twitterRegister__form} onSubmit={handleSubmit(onSubmit)}>
          <input 
            type="text" 
            placeholder="Tên" 
            className={styles.twitterRegister__name} 
            {...register('name', {
              required: { value: true, message: 'Tên là bắt buộc' },
              pattern: { value: /^[A-Za-z\s]+$/, message: 'Tên không được có ký tự đặc biệt' }
            })} 
          />
          <div className={styles.twitterRegister__errors}>{errors.name?.message}</div>

          <input 
            type="text" 
            placeholder="Email" 
            className={styles.twitterRegister__email} 
            {...register('email', {
              required: { value: true, message: 'Email là bắt buộc' },
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không đúng định dạng' }
            })} 
          />
          <div className={styles.twitterRegister__errors}>{errors.email?.message}</div>

          <input 
            type="password" 
            placeholder="Mật khẩu" 
            className={styles.twitterRegister__password} 
            {...register('password', {
              required: { value: true, message: 'Mật khẩu là bắt buộc' },
              minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            })} 
          />
          <div className={styles.twitterRegister__errors}>{errors.password?.message}</div>

          <input 
            type="password" 
            placeholder="Xác nhận mật khẩu" 
            className={styles.twitterRegister__confirm_password} 
            {...register('confirm_password', {
              required: { value: true, message: 'Xác nhận mật khẩu là bắt buộc' },
              validate: value => value === watch('password') || 'Mật khẩu xác nhận không khớp'
            })} 
          />
          <div className={styles.twitterRegister__errors}>{errors.confirm_password?.message}</div>

          <div className={styles.twitterRegister__comment}>
            <h6 className={styles.twitterRegister__title}>Ngày sinh</h6>
            <p className={styles.twitterRegister__desc}>
              Điều này sẽ không được hiển thị công khai. Xác nhận tuổi của bạn, ngay cả khi tài khoản này dành cho doanh nghiệp, thú cưng hoặc thứ gì khác.
            </p>
          </div>
          <input 
            type="date" 
            className={styles.twitterRegister__date} 
            {...register('date_of_birth', {
              required: { value: true, message: 'Bắt buộc chọn ngày sinh' }
            })} 
          />
          <div className={styles.twitterRegister__errors}>{errors.date_of_birth?.message}</div>

          <button type="submit" className={`${btn.btn1} ${btn['btn1-mt100']}`}>
            ĐĂNG KÝ
          </button>
        </form>
      </div>
    </div>
  );
}
