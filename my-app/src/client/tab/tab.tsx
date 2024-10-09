import { useState } from 'react';
import styles from './tab.module.scss';

interface tab{
    Posts:string;
    Replies: string;
    Highlights : string; 
    Media: string; 
    Likes: string
}
export default function Tab(){

    const [tab]= useState<tab>({
        Posts: 'Posts',
        Replies: 'Replies',
        Highlights: 'Highlights',
        Media: 'Media',
        Likes: 'Likes',
    });
    const [activeTab, setActiveTab] = useState('Posts');
    return(
        <>
        <div className={styles.tabs}>
                {[tab.Posts, tab.Replies, tab.Highlights, tab.Media, tab.Likes].map(tab => (
                <button 
                    key={tab}
                    className={`${styles.tab} ${activeTab === tab.toLowerCase() ? styles['tab--active'] : ''}`}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                >
                    {tab}
                </button>
                ))}
        </div>
        <div className={styles.content}>
            <div className={styles.content__title}>Content for{activeTab}</div>
        </div>
        </>
    )
}