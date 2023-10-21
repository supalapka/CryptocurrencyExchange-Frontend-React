import React from "react";
import styles from "../../css/authentication.module.css"
import { auth } from "../../api/api";
import { Navigate } from "react-router-dom";


class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            succeed: null,
        };
    }

    handleEmailChange = (event) => {
        this.setState({ email: event.target.value });
    };

    handlePassChange = (event) => {
        this.setState({ password: event.target.value });
    };

    handleConfrirmPassChange = (event) => {
        this.setState({ confirmPassword: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password, confirmPassword } = this.state;

        if (password === confirmPassword) {
            try {
                const response = await auth.register(email, password);
                if (response.status === 200)
                    await auth.login(email, password);
                    this.setState({ succeed: true });
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }else{
            this.setState({ succeed: false });
        }
    };


    render() {
        return (
            <div className={styles.loginContainer}>
                <section className={styles.login} id="login">
                    <header>
                        <h2>Cryptocurrency Exchange</h2>
                        <h4>Register</h4>
                    </header>
                    <form className={styles.loginForm} onSubmit={this.handleSubmit} >
                        <input type="email" onChange={this.handleEmailChange} className={styles.loginInput} placeholder="Email" required autofocus />
                        <input type="password" onChange={this.handlePassChange} className={styles.loginInput} placeholder="Password" required />
                        <input type="password" onChange={this.handleConfrirmPassChange} className={styles.loginInput} placeholder="Confirm Password" required />
                        <div className={styles.submitContainer}>
                            <button type="submit" className={styles.loginButton}>SIGN UP</button>
                        </div>
                        {typeof this.state.succeed === 'boolean' && (
                            this.state.succeed ? (
                                <Navigate to="/market" replace={true} />
                            ) : (
                                <p className="negative">Invalid data</p>
                            )
                        )}
                    </form>
                </section>
            </div>
        );
    }
}

export default Register;
