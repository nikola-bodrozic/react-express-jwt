import React, { Component } from "react";
import axios from "axios";
var querystring = require("querystring");

class JWTPanel extends Component {
  state = {
    userId: "",
    api: "http://localhost:3008"
  };

  componentDidMount() {
    this.getUsers();
  }
  getUsers = async () => {
    let res = await axios.post(
      this.state.api + "/login",
      querystring.stringify({ username: "mike", password: "pass" })
    );
    let data = await res.data;

    res = await axios.post(
      this.state.api + "/users",
      { name: "asyncawait", email: "test@example.com" },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + data.token
        }
      }
    );
    data = await res.data;
    
    //console.log(data.ID)
    this.setState({ userId: data.ID });
  };

  render() {
    return <h1>user id {this.state.userId}</h1>;
  }
}

export default JWTPanel;
