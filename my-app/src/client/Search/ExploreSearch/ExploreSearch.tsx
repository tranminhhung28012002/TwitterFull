import { useState } from "react";

import styles from './ExploreSearch.module.scss';
import { FaSearch } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { SlArrowRight } from "react-icons/sl";
import { GoArrowLeft } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
interface ExploreSearchProps {
    onSearch: (query: string) => void;
    searchHistory: string[];
    setSearchHistory: (history: string[]) => void;
    onBack: () =>void;
}

export default function ExploreSearch({ onSearch, searchHistory, setSearchHistory,onBack }: ExploreSearchProps) {
    const [isBack, setIsBack] = useState<boolean>(false);
    const [query, setQuery] = useState('');
    const [step, setStep] = useState(1);
    const [showHistory, setShowHistory] = useState(false);
    const [setting, setSetting ] = useState(false);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  
    const handleStep = () =>{
        setStep(prevStep => prevStep + 1)
    }
    //hàm để tắt setting hoặc bật setting
    const handleSetting = () => {
        if(step === 2 ){
            setStep(1);
        }
        else{
            setSetting(!setting);
        }
    };

    //hàm lịch sử tìm kiếm
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query) {
            onSearch(query);
            const updatedHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 20);
            setSearchHistory(updatedHistory);
            setQuery(''); 
        }
    };

    // hiện lịch sử tìm kiếm và trở về trang mặc định của search khi đã nhập tìm kiếm
    const handleFocus = () => {
        setIsBack(true); 
        setShowHistory(true); 
    };

    //lịch sử tìm kiếm có để setimeout tụi m sửa lại không timeout nha
    const handleBlur = () => {
        setTimeout(() => {
            setIsBack(false);
            setShowHistory(false); 
         },200);
    };
    //lịch sử tìm kiếm
    const handleHistoryClick = (item: string) => {
        setQuery(item);
        onSearch(item);
        setShowHistory(false);
    };
    
    return (
        <>
            <div className={styles.exploreSearch}>
                {isBack &&(
                    <GoArrowLeft onClick={onBack} className={styles.backButton}/>
                )}
                <form onSubmit={handleSubmit} className={` ${styles.exploreSearch__form} ${isBack ? styles.shortInput: ''}`}>
                    <FaSearch className={styles.exploreSearch__icon}/>
                    <input
                    
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder="Tìm kiếm..."
                        className={styles.exploreSearch__input}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </form>
                 {/* Cài đặt để nhập vào tìm kiếm (rõ hơn thì vào twitter test cái cài đặt là hiểu) */}
                <IoSettingsOutline className={styles.exploreSearch__settingIcon} onClick={handleSetting} />
                {/* phần lịch sử tìm kiếm */}
                {showHistory && query === '' && (
                <ul className={styles.searchHistory}>
                    {searchHistory.map((item, index) => (
                        <li className={styles.searchHistory__item} key={index} onClick={() => handleHistoryClick(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
            </div>
            {/* cài đặt của tìm kiếm và chưa làm địa chỉ khu vực*/}
            {setting && (
                <div className={styles.show}>
                    <div className={styles.exploreSetting}>
                       {step === 1 &&(
                        <div>
                            <div className={styles.exploreSetting__heading}>
                                <IoMdClose   className={styles.exploreSetting__btn} onClick={handleSetting} />
                                <p className={styles.exploreSetting__title}>Explore settings</p>
                            </div>
                        <div className={`${styles.exploreSetting__item} ${styles['exploreSetting__item-first']}`}>
                            <p className={styles.exploreSetting__title}>Location</p>
                            <div className={styles.exploreSetting__desc}>
                                <div>
                                    <p className={styles.exploreSetting__showContent}>Show content in this location</p>
                                    <p className={styles.exploreSetting__contentLocation}>When this is on, you’ll see what’s happening around you right now.</p>
                                </div>
                                <input type="checkbox" className={styles.exploreSetting__check}/>
                           </div>
                           <div className={styles.exploreSetting__desc}>
                                <div>
                                    <p className={styles.exploreSetting__showContent}>Explore location</p>
                                    <p className={styles.exploreSetting__contentLocation}>Vietnam</p>
                                </div>
                                <SlArrowRight className={styles.exploreSetting__icon} onClick={handleStep}/>
                           </div>
                        </div>
                        <div className={styles.exploreSetting__item}>
                            <p className={styles.exploreSetting__title}>Personalization</p>
                            <div className={styles.exploreSetting__desc}>
                                <div>
                                <p className={styles.exploreSetting__showContent}>Trends for you</p>
                                <p className={styles.exploreSetting__contentLocation}>You can personalize trends based on your location and who you follow.</p>
                                </div>
                                <input type="checkbox" className={styles.exploreSetting__check}/>
                            </div>
                        </div>
                        </div>
                       )}
                        {step === 2 &&(
                        <div>
                            <div className={styles.exploreSetting__heading}>
                                <GoArrowLeft onClick={handleSetting} className={styles.exploreSetting__btn}/>
                                <p className={styles.exploreSetting__title}>Explore settings</p>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            )}
           
        </>
    );
}
