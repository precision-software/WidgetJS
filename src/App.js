import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Widget from './Widget.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

          <Widget server="http://localhost:8080"  count="15"></Widget>
      </div>
    );
  }
}

export default App;
