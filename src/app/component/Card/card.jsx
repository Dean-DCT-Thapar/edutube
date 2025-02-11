import React from "react";
import styles from './card.module.css';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Cards = (props) => {
    return(
        <div className={styles.card}>
            <div className={styles.link}><OpenInNewIcon/></div>
            <div className={styles.prof}>Hem Dutt Joshi</div>
            <div className={styles.course}>
                <p className={styles.coursename}>{props.name}</p>
                <p className={styles.coursecode}>UES103</p>
            </div>
            <div className={styles.progress}>
                <p className={styles.prog}>11/34 Lessons Completed</p>
                <div className={styles.progbar}></div>
            </div>
        </div>
    );
}

export default Cards