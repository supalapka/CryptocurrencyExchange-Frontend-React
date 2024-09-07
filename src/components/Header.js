import React from "react";
import styles from "../css/header.module.css";
import SearchWithSuggestions from "./SearchWithSuggestions";
import { auth } from "../api/api";
import { Link } from "react-router-dom";


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      email: '',
    };
  }

  async checkIfLoggedIn() {
    try {
      const responce = await auth.checkIfLoggedIn();

      if (responce.status === 200) {
        this.setState({ isLoggedIn: true });
        this.setState({ email: responce.data });
      }
    } catch (error) {
      if (error.response.status === 400) {
        // user are not log in
      }
    }
  }

  async componentDidMount() {
    await this.checkIfLoggedIn();
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
            <Link to="/login">Login</Link> / <Link to="/register">Register</Link>
            {/* {!this.state.isLoggedIn
              ? <Link to="/profile">{this.state.email}</Link>
              : <Link to="/login">Login</Link> / <Link to="/register">Register</Link>
            } */}
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
