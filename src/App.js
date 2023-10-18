import React from "react";
import "./css/main.css"
import Header from "./components/Header";
import { router } from "./router";


class App extends React.Component {
  render() {

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
