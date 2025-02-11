import React from "react";
import styles from './card.module.css';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Cards = (props) => {
    return(
        <div className={styles.card}>
            <div className={styles.link}><OpenInNewIcon/></div>
            <div className={styles.prof}>{props.teacher}</div>
            <div className={styles.course}>
                <p className={styles.coursename}>{props.name}</p>
                <p className={styles.coursecode}>{props.course_code}</p>
            </div>
            <div className={styles.progress}>
                <p className={styles.prog}>{props.completed_lessons +"/"+props.total_lessons +" Lessons Completed"}</p>
                <div className={styles.progbar}>
                    <div 
                        className={styles.filled} 
                        style={{ width: `${(props.completed_lessons / props.total_lessons) * 100}%` }} 
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default Cards