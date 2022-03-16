const { hardLookup, softLookup, splitLookup } = require('./v1');
const { getValue } = require('../helper');
const { actions } = require('../actions');

const bookStrategy = ({ hands, dealerFaceUp }) => {
  const playerValue = Math.max(...getValue(hands));
  let playerAction;
  if (hands.every((card) => card.value === hands[0].value)) {
    playerAction = splitLookup[dealerFaceUp.value][playerValue];
    if (playerAction === actions.Split) {
      return actions.Split;
    }
  }

  if (hands.length === 2 && hands.some((card) => card.rank === 'Ace')) {
    playerAction = softLookup[dealerFaceUp.value][playerValue];
  }

  // Means that it's soft, but there's more than 2 cards
  else if (hands.length > 2 && getValue(hands).length > 1) {
    const thirdCardAction = softLookup[dealerFaceUp.value][playerValue];
    playerAction = thirdCardAction === actions.Double ? actions.Hit : thirdCardAction;
  } else {
    playerAction = hardLookup[dealerFaceUp.value][playerValue];
  }

  if (playerAction === actions.Surrender && hands.length > 2) {
    // Should probably implement surrender logic ... to decide to hit or stay
    // default to "Hit"
    return actions.Hit;
  }

  return playerAction || actions.Stand;
};

module.exports = {
  bookStrategy,
};
