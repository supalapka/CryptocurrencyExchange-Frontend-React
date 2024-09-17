import React from "react";
import styles from "../css/header.module.css";
import SearchWithSuggestions from "./SearchWithSuggestions";
import { auth } from "../api/api";
import { Link } from "react-router-dom";
import { ema } from "react-financial-charts";


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      email: undefined,
    };
  }

  async componentDidMount() {
    const email = auth.getUserEmail();

    if (email != '')
      this.setState({ email: email, isLoggedIn: true });
  }

  render() {
    return (
      <header className={`${styles.header} default-bg`}>

        <div className={styles.headerElements}>
          <div className={styles.logo}>
            <Link to="/">Crypto Exchange</Link>
          </div>

          <SearchWithSuggestions />

          <nav>
            <ul>
              <li>
                <Link to="/market">Market</Link>
              </li>
              <li>
                <Link to="/futures">Futures</Link>
              </li>
              <li>
                <Link to="/staking">Staking</Link>
              </li>
            </ul>
          </nav>
          <div className={styles.user}>

            {this.state.isLoggedIn ? (
              <Link to="/profile">{this.state.email}</Link>
            ) : (
              <>
                <Link to="/login">Login</Link> / <Link to="/register">Register</Link>
              </>
            )}

          </div>
        </div>
      </header>
    );
  }
}

export default Header;
