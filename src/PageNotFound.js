import React from 'react';
import styles from './css/pagenotfound.module.css';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.errorCode}>404</div>
            <div className={styles.errorMessage}>Page Not Found</div>
            <div className={styles.description}>We apologize, but the page you are looking for cannot be found.</div>
            <Link  to="/" className={styles.button}>Go to Homepage</Link>
        </div>
    </div>

    );
}

export default PageNotFound;
