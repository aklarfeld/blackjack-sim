const { actions } = require('./actions');
const { bookStrategy } = require('./books');
const { getValue } = require('./helper');

const hiLoCountingStrategy = ({ card }) => {
  if (card.value <= 6) return 1;
  if (card.value > 6 && card.value < 10) return 0;
  return -1;
};

// Dealer strategy
// Stand on soft 17
const simpleStrategy = ({ hands }) => {
  const maxPlayerValue = Math.max(...getValue(hands));
  const minPlayerValue = Math.min(...getValue(hands));
  const playerValue = maxPlayerValue > 21 ? minPlayerValue : maxPlayerValue;
  // Hit if the player value is less than 17
  if (playerValue < 17) {
    return actions.Hit;
  }

  return actions.Stand;
};

module.exports = {
  simpleStrategy,
  bookStrategy,
  hiLoCountingStrategy,
};
