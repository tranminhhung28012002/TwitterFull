import styles from './ExploreFilter.module.scss';
interface SearchFilterProps{
    onFilterChange: (filter:string) => void;
    selectedFilter: string;
}
export default function ExploreFilter({onFilterChange,selectedFilter} :SearchFilterProps){

    // phần bộ lọc Search
    return (
        <div className={styles.searchFilters}>
            <h3 className={styles.searchFilters__heading}>Search filters</h3>
            <div className={styles.filterGroup}>
                <div>
                <h4 className={styles.filterGroup__heading}>People</h4>
                <label>
                    <input
                        type="radio"
                        checked={selectedFilter === 'fromAnyone'}
                        onChange={() => onFilterChange('fromAnyone')}
                    />
                    From anyone
                </label>
                <label>
                    <input
                        type="radio"
                        checked={selectedFilter === 'peopleYouFollow'}
                        onChange={() => onFilterChange('peopleYouFollow')}
                    />
                    People you follow
                </label>
                </div>
                <div className={styles.filterGroup__item}>
                <h4 className={styles.filterGroup__heading}>Location</h4>
                <label>
                    <input
                        type="radio"
                        checked={selectedFilter === 'anywhere'}
                        onChange={() => onFilterChange('anywhere')}
                    />
                    Anywhere
                </label>
                <label>
                    <input
                        type="radio"
                        checked={selectedFilter === 'nearYou'}
                        onChange={() => onFilterChange('nearYou')}
                    />
                    Near you
                </label>
                </div>
                <a href="/" className={styles.filterGroup__advancedSearch}>Advenced Search</a>
            </div>
        </div>
    );
}