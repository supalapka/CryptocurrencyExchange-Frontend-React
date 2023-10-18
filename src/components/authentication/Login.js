import React from "react";
import styles from "../../css/authentication.module.css"
import { auth } from "../../api/api";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePassChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;

    try {
      await auth.login(email, password);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  render() {
    return (
      <div className={styles.loginContainer}>
        <section className={styles.login} id="login">
          <header>
            <h2>Cryptocurrency Exchange</h2>
            <h4>Login</h4>
          </header>
          <form className={styles.loginForm} onSubmit={this.handleSubmit} >
            <input type="email" onChange={this.handleEmailChange} className={styles.loginInput} placeholder="Email" required autofocus />
            <input type="password" onChange={this.handlePassChange} className={styles.loginInput} placeholder="Password" required />
            <div className={styles.submitContainer}>
              <button type="submit" className={styles.loginButton}>SIGN IN</button>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default Login;
