import React from "react";
import "./css/main.css"
import Header from "./components/Header";
import { router } from "./router";

import { auth } from "./api/api";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async checkIfLoggedIn() {
    try {
      const response = await auth.checkIfLoggedIn();
      if (response.status === 200) {
        this.setState({ loading: false });
      }
    } catch (error) {
      if (error.response.status === 400) {
        this.setState({ loading: false });
      }
    }
  }

  async componentDidMount() {
    await this.checkIfLoggedIn();
  }

  render() {

    if (this.state.loading) {
      return <div>Loading...</div>; 
    }

    return (
      <div>
        <Header />
        <div className="content">
          {router()}
        </div>
      </div>
    );
  }
}

export default App;
