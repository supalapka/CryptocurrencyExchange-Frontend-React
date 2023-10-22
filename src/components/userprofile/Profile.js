import React from "react";
import styles from "../../css/profile/profile.module.css"
import { Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

class Profile extends React.Component {
    render() {
        return (
            <div className={styles.row}>
                <div className={`${styles.sidebar} default-bg`}>
                    <div className={styles.header}>
                        <h1>Profile</h1>
                    </div>
                    <ul className={styles.navLinks}>
                        <li><Link to="wallet"> <FontAwesomeIcon icon={faWallet} />  Wallet</Link></li>
                        <li><Link to="staking" > <FontAwesomeIcon icon={faCoins} />  Staking</Link></li>
                        <li><Link to="transfer" > <FontAwesomeIcon icon={faCircleDollarToSlot} />  Transfer</Link></li>
                        <li className={styles.logout}><Link to="#"> <FontAwesomeIcon icon={faRightFromBracket} /> Log out</Link></li>
                    </ul>
                </div>

                <div className={styles.profileContent}>
                    <Outlet />
                </div>
            </div>
        );
    }
}

export default Profile;
