import React, { Component } from "react";
import "./App.css";
import Posts from "./components/Posts";
import Product from "./components/Product";
import Contact from "./components/Contact";
import JWTPanel from './components/JWTPanel'

class App extends Component {
  state = { contacts: [] };

  componentDidMount() {
    fetch("https://api.randomuser.me/?nat=us,gb&results=5")
      .then(response => response.json())
      .then(parsedResponse =>
        parsedResponse.results.map(user => ({
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          thumbnail: user.picture.thumbnail
        }))
      )
      .then(contacts => this.setState({ contacts }));
  }

  render() {
    return (
      <div className="App">
        <Posts />
        <Product />
        <Contact contacts={this.state.contacts} />
        <JWTPanel />
      </div>
    );
  }
}

export default App;
