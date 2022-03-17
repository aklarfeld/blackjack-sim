const parser = require('simple-args-parser');
const { hardLookup, softLookup, splitLookup, countLookup } = require('./v1');
const { getValue } = require('../helper');
const { actions } = require('../actions');

const args = parser.parse(process.argv, {
  long: ['doubleAfterSplit', 'countCards'],
  short: [],
  stupid: [],
});

const bookStrategy = ({
  hands,
  dealerFaceUp,
  hasSplit,
  trueCount,
  canDoubleAfterSplit = args.doubleAfterSplit,
  isCardCountingActive = args.countCards,
}) => {
  const playerValue = Math.max(...getValue(hands));
  let playerAction = countLookup({ hands, playerValue, dealerFaceUp, trueCount });

  // If there's a better move with a count, do it.
  if (playerAction && isCardCountingActive) {
    return playerAction;
  }

  if (hands.length === 2 && hands.every((card) => card.value === hands[0].value)) {
    playerAction = splitLookup[dealerFaceUp.value][playerValue];

    if (playerAction === actions.DoubleAfterSplit && canDoubleAfterSplit) {
      return actions.Split;
    }

    if (playerAction === actions.Split) {
      return actions.Split;
    }
  }

  if (hands.length === 2 && hands.some((card) => card.rank === 'Ace')) {
    // Implement logic here to block doubles after splits, if needed
    playerAction = softLookup[dealerFaceUp.value][playerValue];
    if (playerAction === actions.Double && !canDoubleAfterSplit && hasSplit) {
      return actions.Hit;
    }
    return playerAction;
  }

  // Means that it's soft, but there's more than 2 cards
  if (hands.length > 2 && getValue(hands).length > 1) {
    const thirdCardAction = softLookup[dealerFaceUp.value][playerValue];
    playerAction = thirdCardAction === actions.Double ? actions.Hit : thirdCardAction;
  } else {
    playerAction = hardLookup[dealerFaceUp.value][playerValue];
  }

  return playerAction || actions.Stand;
};

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
  bookStrategy,
  hiLoCountingStrategy,
  simpleStrategy,
  softLookup,
  hardLookup,
  splitLookup,
  countLookup,
};
