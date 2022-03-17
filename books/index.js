const { hardLookup, softLookup, splitLookup, countLookup } = require('./v1');
const { getValue } = require('../helper');
const { actions } = require('../actions');

const bookStrategy = ({
  hands,
  dealerFaceUp,
  hasSplit,
  trueCount,
  canDoubleAfterSplit = true,
  isCardCountingActive = true,
}) => {
  const playerValue = Math.max(...getValue(hands));
  let playerAction = countLookup({ hands, playerValue, dealerFaceUp, trueCount });

  // If there's a better move with a count, do it.
  if (playerAction && isCardCountingActive) {
    return playerAction;
  }

  if (hands.every((card) => card.value === hands[0].value)) {
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

  return playerAction;
};

module.exports = {
  bookStrategy,
};
