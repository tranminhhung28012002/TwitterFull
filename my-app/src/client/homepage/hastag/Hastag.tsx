import styles from './Hastag.module.scss'
interface HastagProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export default function Hastag({ value, onChange }: HastagProps) {
  return <input type='text' placeholder='#Hastag' value={value} onChange={onChange} className={styles.hastag} />
}
