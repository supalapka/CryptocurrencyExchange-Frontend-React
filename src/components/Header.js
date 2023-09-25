import React from "react";
import "../css/header.css";

import SearchWithSuggestions from "./SearchWithSuggestions";

class Header extends React.Component {
  render() {
    return (
      <header className="default-bg">
        <div className="headerElements">
          <div className="logo">
            <a href="/home">Crypto Exchange</a>
          </div>

          <SearchWithSuggestions />

          <nav>
            <ul>
              <li>
                <a href="/market">Market</a>
              </li>
              <li>
                <a href="/futures">Futures</a>
              </li>
              <li>
                <a href="/staking">Staking</a>
              </li>
            </ul>
          </nav>
          <div className="user">
            <a href="/login">Login</a> / <a href="/register">Register</a>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
