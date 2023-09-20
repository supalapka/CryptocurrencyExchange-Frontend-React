import React, { Component } from "react";
import { allCryptoSymbols } from "../utils";

class SearchWithSuggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      suggestions: [],
    };
  }

  handleInputChange = (event) => {
    const query = event.target.value;
    const matchingSuggestions = allCryptoSymbols.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );

    this.setState({
      query,
      suggestions: matchingSuggestions,
    });
  };

  render() {
    return (
      <div className="dropdown">
        <input
          type="text"
          value={this.state.query}
          onChange={this.handleInputChange}
          placeholder="Search Coin"
          className="search-input"
        />
        <div className="dropdown-content">
          {this.state.query &&
            this.state.suggestions.map((suggestion, index) => (
              <a key={index} href={`/market/${suggestion}`}>
                {suggestion}
              </a>
            ))}
        </div>
      </div>
    );
  }
}

export default SearchWithSuggestions;
