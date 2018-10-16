import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LuckySeven from './LuckySeven';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div>
            <Route exact path="/" component={LuckySeven} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
