import React from 'react';
import styles from "./searchbar.module.css"
import SearchIcon from '@mui/icons-material/Search';
// import FilterIcon from 'src\app\assets\filter.svg';
import FilterIcon from '@mui/icons-material/FilterAlt'

const searchbar = () => {
    return (
        <div className={styles.main}>
            <div className={styles.filterdiv}><FilterIcon className={styles.filter}/></div>
            <input type="text" className={styles.textbox} placeholder='Search'/>
            <div className={styles.searchdiv}><SearchIcon className={styles.search}/></div>
        </div>
    );
}

export default searchbar;