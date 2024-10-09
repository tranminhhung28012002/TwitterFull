import { useState } from "react";
import styles from "./Mentions.module.scss";
import { MdOutlineCancel } from "react-icons/md";
export default function Mentions() {
  const [mentions, setMentions] = useState(false);
  const handleMetions = () => {
    setMentions(!mentions);
  };
  return (
    <>
      <button className={styles.btn} onClick={handleMetions}>
        Mentions
      </button>

      {mentions && (
        <div className={styles.show}>
          <div className={styles.Mentions__form}>
            <div className={styles.Mentions__title}>
              <p className={styles.Mentions__heading}>
                Select friends to send to
              </p>
              <MdOutlineCancel
                onClick={handleMetions}
                className={styles.Mentions__cancel}
              />
            </div>
            <ul className={styles.Mentions__list}>
              <li className={styles.Mentions__item}>
                <input type="checkbox" className={styles.Mentions__btn} />
                <p className={styles.Mentions__name}>nguoi thu n</p>
              </li>
              <li className={styles.Mentions__item}>
                <input type="checkbox" className={styles.Mentions__btn} />
                <p className={styles.Mentions__name}>nguoi thu n</p>
              </li>
              <li className={styles.Mentions__item}>
                <input type="checkbox" className={styles.Mentions__btn} />
                <p className={styles.Mentions__name}>nguoi thu n</p>
              </li>
              <li className={styles.Mentions__item}>
                <input type="checkbox" className={styles.Mentions__btn} />
                <p className={styles.Mentions__name}>nguoi thu n</p>
              </li>
            </ul>
            <button onClick={handleMetions} className={styles.Mentions__send}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
