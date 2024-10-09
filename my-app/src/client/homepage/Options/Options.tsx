import Mentions from '../Mentions'
import styles from './Options.module.scss'
import earth from '../icon/earth.svg'
import { useEffect, useRef, useState } from 'react'
interface OptionsProps {
  onUserIDChange: (newUserID: string) => void // Nhận hàm từ Homepage
}
export default function Options({ onUserIDChange }: OptionsProps) {
  const [option, setOption] = useState(false) //hiện form chỉnh public hoặc chỉ những người theo dõi
  const [replyOption, setReplyOption] = useState('Everyone can reply') // Default display text
  const handleUserIDChange = (isEveryCanReply: boolean) => {
    const optionText = isEveryCanReply ? 'Everyone can reply' : 'Account to follow'
    const newUserID = isEveryCanReply ? '0' : '1'
    setReplyOption(optionText)
    setOption(false)
    onUserIDChange(newUserID)
  }
  const handleOption = () => {
    setOption(!option)
  }
  const OptionRef = useRef<HTMLDivElement>(null)
  const handleClickOutside = (event: MouseEvent) => {
    if (OptionRef.current && !OptionRef.current.contains(event.target as Node)) {
      setOption(false)
    }
  }
  useEffect(() => {
    if (option) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [option])
  return (
    <>
      <div className={styles.Options__object}>
        <div className={styles.Options__every} onClick={handleOption}>
          <img src={earth} alt='Earth' />
          <p className={styles.Options__every__reply}>{replyOption}</p>
        </div>
        <Mentions />
      </div>
      {option && (
        <div ref={OptionRef} className={styles.Options__options}>
          <p className={styles.Options__every__reply} onClick={() => handleUserIDChange(true)}>
            Everyone can reply
          </p>
          <p className={styles.Options__every__reply} onClick={() => handleUserIDChange(false)}>
            Account to follow
          </p>
        </div>
      )}
    </>
  )
}
