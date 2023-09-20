import React from "react";
import "./css/main.css"
import Header from "./components/Header";

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <h1>Hello crypto exhange</h1>
      </div>
    );
  }
}

export default App;
