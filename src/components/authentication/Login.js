import React from "react";
import "../../css/main.css"
import "../../css/authentication.css"
import axios from "axios";

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
      const loginResponse = await axios.post(`https://localhost:44363/login`, {
        email: email,
        password: password,
      });

      let jwt = loginResponse.data;
      localStorage.setItem('jwt', jwt);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt;
      console.log(jwt);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  render() {
    return (
      <div class="login-container">
        <section class="login" id="login">
          <header>
            <h2>Cryptocurrency Exchange</h2>
            <h4>Login</h4>
          </header>
          <form class="login-form" onSubmit={this.handleSubmit} >
            <input type="email" onChange={this.handleEmailChange} class="login-input" placeholder="Email" required autofocus />
            <input type="password" onChange={this.handlePassChange} class="login-input" placeholder="Password" required />
            <div class="submit-container">
              <button type="submit" class="login-button">SIGN IN</button>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default Login;