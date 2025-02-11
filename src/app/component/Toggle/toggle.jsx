import React, {useState} from 'react'
import styles from './toggle.module.css'

const Toggle = ({ setActiveTab }) => {
    return (
        // <div className={styles.switch}>
        //     <button className={styles.tab}>Courses</button>
        //     <button className={styles.tab}>History</button>
        // </div>
        <div className={styles.switch}>
        <button className={`${styles.tab} ${styles.active}`} onClick={() => { setActiveTab("Courses"); }}>
        Courses
        </button>

        <button className={`${styles.tab}`} onClick={() => { setActiveTab("History"); }}>
        History
        </button>
    </div>
    );
}

export default Toggle