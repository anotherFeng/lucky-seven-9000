import React, { Component } from 'react';
import axios from 'axios';

class LuckySeven extends Component {
  state = {
    seenIndexes: [],
    scores: {},
    startingBet: ''
  };

  componentDidMount() {
    this.fetchHistoricHighestScores();
    this.fetchIndexes();
  }

  async fetchHistoricHighestScores() {
    const scores = await axios.get('/api/score/historic');
    this.setState({ scores: scores.data });
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get('/api/values/all');
    this.setState({
      seenIndexes: seenIndexes.data
    });
  }

  handlePlay = () => {
    console.log(this.state.startingBet)
    axios.post('/api/play', {
      startingBet: this.state.startingBet
    });
    this.setState({ index: '' });
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(', ');
  }

  renderHistoricHighestScores() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <div>
          <h1>Lucky Sevens</h1>
        </div>
        <div>
          <label>Starting Bet: </label>
          <span>$
            <input
              value={this.state.startingBet}
              onChange={event => this.setState({ startingBet: event.target.value })}
            />
          </span>
        </div>
        <div>
          <button onClick={this.handlePlay} id="play">Play</button>
        </div>
        <div id="resultTable" >
          <table align="center">
            <caption>Results</caption>
            <tbody>
              <tr>
                <td>Starting Bet</td>
                <td><span id="initBet"></span></td>
              </tr>
              <tr>
                <td>Total Rolls Before Going Broke</td>
                <td><span id="result1"></span></td>
              </tr>
              <tr>
                <td>Highest Amount Won</td>
                <td><span id="result2"></span></td>
              </tr>
              <tr>
                <td>Roll Count at Highest Amount Won</td>
                <td><span id="result3"></span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    );
  }
}

export default LuckySeven;
