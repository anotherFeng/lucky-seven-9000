const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

// function luckySeven(startingBet) {
//   const currentAmount = startingBet;
//   const totalRolls = 0;
//   const scores = [0];
//   while(startingBet > 0) {
//     let die1 = Math.floor((Math.random()*6)+1);
//     let die2 = Math.floor((Math.random()*6)+1);
//     if (die1 + die2 === 7){
//       currentAmount += 4;
//     }
//     else {
//       currentAmount -= 1;
//     }
//     scores.push(currentAmount);
//     currentAmount -- ;
//     totalRolls ++ ;
//   };
//   const highestScore = Math.max.apply(Math, scores);
//   const rollCountAtHighestAmountWon = scores.indexOf(highestScore);
//   return [totalRolls, highestScore, rollCountAtHighestAmountWon];
// }

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, luckySeven(parseInt(message)));
});
sub.subscribe('insert');