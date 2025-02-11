import React, {useState} from 'react'
import styles from './toggle.module.css'

const toggle = () =>{
    const [activeTab, setActiveTab] = useState("Courses");
    return (
        // <div className={styles.switch}>
        //     <button className={styles.tab}>Courses</button>
        //     <button className={styles.tab}>History</button>
        // </div>
        <div className={styles.switch}>
        <button className={`${styles.tab} ${activeTab === "Courses" ? styles.active : ""}`} onClick={() => setActiveTab("Courses")}>
        Courses
        </button>

        <button className={`${styles.tab} ${activeTab === "History" ? styles.active : ""}`} onClick={() => setActiveTab("History")}>
        History
        </button>
    </div>
    );
}

export default toggle