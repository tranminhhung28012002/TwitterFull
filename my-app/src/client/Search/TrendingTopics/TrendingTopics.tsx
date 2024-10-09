import { useEffect, useState } from 'react';
import styles from './TrendingTopics.module.scss';

interface TrendingTopicsProps {
    topics: {
        id: number;
        title: string;
    }[];
}

export default function TrendingTopics({topics}: TrendingTopicsProps){
    // cập nhật 'activeTab' khi danh sách 'topics' thay đổi
    // Nếu danh sách 'topics' có ít nhất một phần tử, set 'activeTab' thành tiêu đề
    // của phần tử đầu tiên, viết thường để đảm bảo tính đồng nhất
    const [activeTab, setActiveTab] = useState('for you');
    useEffect(() => {
        if (topics.length > 0) {
            setActiveTab(topics[0].title.toLowerCase()); 
        }
    }, [topics]);

    if (!topics || topics.length === 0) {
        return null; 
    }

    return(
        //Tiêu đề Search
    <div className={styles.trendingTopics}>
        <div className={styles.trendingTopics__list}>
            {topics.map(topic => 
            //này là đọc hết để view ra 
                <button key={topic.id} className={`${styles.trendingTopics__item} ${activeTab === topic.title.toLowerCase() ? styles['trendingTopics__item--aticle'] : ''}`}
                onClick={() =>setActiveTab(topic.title.toLowerCase())}>
                {topic.title}
                </button>
            )}
        </div>
    </div>
    );
}