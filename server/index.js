const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS scores ("total-rolls" INT, "roll-counts" INT, "highest-score" INT)')
  .catch(err => console.log(err));

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

const luckySeven = (startingBet) => {
  let currentAmount = startingBet;
  let totalRolls = 0;
  const scores = [0];
  while(currentAmount > 0) {
    let die1 = Math.floor((Math.random()*6)+1);
    let die2 = Math.floor((Math.random()*6)+1);
    if (die1 + die2 === 7){
      currentAmount += 4;
    }
    else {
      currentAmount -= 1;
    }
    scores.push(currentAmount);
    currentAmount -- ;
    totalRolls ++ ;
  };
  const highestScore = Math.max.apply(Math, scores);
  const rollCountAtHighestAmountWon = scores.indexOf(highestScore);
  return [totalRolls, rollCountAtHighestAmountWon, highestScore];
}

// Express route handlers

app.get('/', (req, res) => {
  res.send('yo');
});

app.get('/scores/historic', async (req, res) => {
  const scores = await pgClient.query('SELECT "highest-score" from scores ORDER BY "highest-score" DESC LIMIT 10');
  const results = [];
  for(let i = 0; i < scores.rows.length; i++) {
    results.push(scores.rows[i]['highest-score'])
  }
  console.log(results)
  res.send(results);
});

app.post('/play', (req, res) => {
  const startingBet = req.body.startingBet;
  let results = luckySeven(parseInt(startingBet));
  pgClient.query('INSERT INTO scores("total-rolls", "roll-counts", "highest-score") VALUES($1, $2, $3)', results)
  res.status(200).send({ working: true, results });
});

app.get('/scores/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

// app.post('/values', async (req, res) => {
//   const index = req.body.index;

//   if (parseInt(index) > 40) {
//     return res.status(422).send('Index too high');
//   }

//   redisClient.hset('values', index, 'Nothing yet!');
//   redisPublisher.publish('insert', index);
//   pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

//   res.send({ working: true });
// });

app.listen(5000, err => {
  console.log('Listening');
});