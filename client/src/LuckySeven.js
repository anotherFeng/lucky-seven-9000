import React, { Component } from 'react';
import axios from 'axios';

class LuckySeven extends Component {
  state = {
    scores: [],
    startingBet: '',
    totalRolls: '',
    highestScore: '',
    rollCounts: '',
  };

  componentDidMount() {
    this.fetchHistoricHighestScores();
  }

  async fetchHistoricHighestScores() {
    const scores = await axios.get('/api/scores/historic');
    this.setState({ scores: scores.data });
  }

  handlePlay = () => {
    const startingBet = this.startingBet;
    axios.post('/api/play', {
      startingBet: this.state.startingBet
    }).then(({data : {results}}) => {
      this.setState({
        startingBet,
        totalRolls: results[0],
        rollCounts: results[1],
        highestScore: results[2]
      });
    })
    this.setState({ startingBet: '' });
  };

  renderHistoricHighestScores() {
    const entries = [];
    for (let i = 0; i < this.state.scores.length; i++ ) {
      entries.push(
        <tr key={i}>
          {this.state.scores[i]}
        </tr>
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
                <td>{this.state.startingBet}</td>
              </tr>
              <tr>
                <td>Total Rolls Before Going Broke</td>
                <td>{this.state.totalRolls}</td>
              </tr>
              <tr>
                <td>Highest Amount Won</td>
                <td>{this.state.highestScore}</td>
              </tr>
              <tr>
                <td>Roll Count at Highest Amount Won</td>
                <td>{this.state.rollCounts}</td>
              </tr>
            </tbody>
          </table>

          <table align="center">
            <caption>Historic Results</caption>
            <tbody>
              {this.renderHistoricHighestScores()}
            </tbody>
          </table>
        </div>
      </div>

    );
  }
}

export default LuckySeven;