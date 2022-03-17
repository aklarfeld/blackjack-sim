// Strategy: https://www.blackjackapprenticeship.com/wp-content/uploads/2018/08/BJA_Basic_Strategy.jpg

const { actions } = require('../actions');
const { ranks } = require('../deck');
// Dealer Upcard is the first key, total max value is the second key

// Hard means no ace
const hardLookup = {
  2: {
    5: actions.Hit,
    6: actions.Hit,
    7: actions.Hit,
    8: actions.Hit,
    9: actions.Hit,
    10: actions.Double,
    11: actions.Double,
    12: actions.Hit,
    13: actions.Stand,
    14: actions.Stand,
    15: actions.Stand,
    16: actions.Stand,
    17: actions.Stand,
  },
  3: {
    5: actions.Hit,
    6: actions.Hit,
    7: actions.Hit,
    8: actions.Hit,
    9: actions.Double,
    10: actions.Double,
    11: actions.Double,
    12: actions.Hit,
    13: actions.Stand,
    14: actions.Stand,
    15: actions.Stand,
    16: actions.Stand,
    17: actions.Stand,
  },
  4: {
    5: actions.Hit,
    6: actions.Hit,
    7: actions.Hit,
    8: actions.Hit,
    9: actions.Double,
    10: actions.Double,
    11: actions.Double,
    12: actions.Stand,
    13: actions.Stand,
    14: actions.Stand,
    15: actions.Stand,
    16: actions.Stand,
    17: actions.Stand,
  },
  5: {
    5: actions.Hit,
    6: actions.Hit,
    7: actions.Hit,
    8: actions.Hit,
    9: actions.Double,
    10: actions.Double,
    11: actions.Double,
    12: actions.Stand,
    13: actions.Stand,
    14: actions.Stand,
    15: actions.Stand,
    16: actions.Stand,
    17: actions.Stand,
  },
  6: {
    5: actions.Hit,
    6: actions.Hit,
    7: actions.Hit,
    8: actions.Hit,
    9: actions.Double,
    10: actions.Double,
    11: actions.Double,
    12: actions.Stand,
    13: actions.Stand,
    14: actions.Stand,
    15: actions.Stand,
    16: actions.Stand,
    17: actions.Stand,
  },
  7: {
    5: actions.Hit,
    6: actions.Hit,
    7: actions.Hit,
    8: actions.Hit,
    9: actions.Hit,
    10: actions.Double,
    11: actions.Double,
    12: actions.Hit,
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Hit,
    17: actions.Stand,
  },
  8: {
    5: actions.Hit,
    6: actions.Hit,
    7: actions.Hit,
    8: actions.Hit,
    9: actions.Hit,
    10: actions.Double,
    11: actions.Double,
    12: actions.Hit,
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Hit,
    17: actions.Stand,
  },
  9: {
    5: actions.Hit,
    6: actions.Hit,
    7: actions.Hit,
    8: actions.Hit,
    9: actions.Hit,
    10: actions.Double,
    11: actions.Double,
    12: actions.Hit,
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Surrender,
    17: actions.Stand,
  },
  10: {
    5: actions.Hit,
    6: actions.Hit,
    7: actions.Hit,
    8: actions.Hit,
    9: actions.Hit,
    10: actions.Hit,
    11: actions.Double,
    12: actions.Hit,
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Surrender,
    16: actions.Surrender,
    17: actions.Stand,
  },
  11: {
    5: actions.Hit,
    6: actions.Hit,
    7: actions.Hit,
    8: actions.Hit,
    9: actions.Hit,
    10: actions.Hit,
    11: actions.Double,
    12: actions.Hit,
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Surrender,
    17: actions.Stand,
  },
};

// Soft means there's an Ace
const softLookup = {
  2: {
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Hit,
    17: actions.Hit,
    18: actions.Double,
    19: actions.Stand,
    20: actions.Stand,
  },
  3: {
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Hit,
    17: actions.Double,
    18: actions.Double,
    19: actions.Stand,
    20: actions.Stand,
  },
  4: {
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Double,
    16: actions.Double,
    17: actions.Double,
    18: actions.Double,
    19: actions.Stand,
    20: actions.Stand,
  },
  5: {
    13: actions.Double,
    14: actions.Double,
    15: actions.Double,
    16: actions.Double,
    17: actions.Double,
    18: actions.Double,
    19: actions.Stand,
    20: actions.Stand,
  },
  6: {
    13: actions.Double,
    14: actions.Double,
    15: actions.Double,
    16: actions.Double,
    17: actions.Double,
    18: actions.Double,
    19: actions.Double,
    20: actions.Stand,
  },
  7: {
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Hit,
    17: actions.Hit,
    18: actions.Stand,
    19: actions.Stand,
    20: actions.Stand,
  },
  8: {
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Hit,
    17: actions.Hit,
    18: actions.Stand,
    19: actions.Stand,
    20: actions.Stand,
  },
  9: {
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Hit,
    17: actions.Hit,
    18: actions.Hit,
    19: actions.Stand,
    20: actions.Stand,
  },
  10: {
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Hit,
    17: actions.Hit,
    18: actions.Hit,
    19: actions.Stand,
    20: actions.Stand,
  },
  11: {
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Hit,
    17: actions.Hit,
    18: actions.Hit,
    19: actions.Stand,
    20: actions.Stand,
  },
};

const splitLookup = {
  2: {
    22: actions.Split,
    20: actions.DontSplit,
    18: actions.Split,
    16: actions.Split,
    14: actions.Split,
    12: actions.DoubleAfterSplit,
    10: actions.DontSplit,
    8: actions.DontSplit,
    6: actions.DoubleAfterSplit,
    4: actions.DoubleAfterSplit,
  },
  3: {
    22: actions.Split,
    20: actions.DontSplit,
    18: actions.Split,
    16: actions.Split,
    14: actions.Split,
    12: actions.Split,
    10: actions.DontSplit,
    8: actions.DontSplit,
    6: actions.DoubleAfterSplit,
    4: actions.DoubleAfterSplit,
  },
  4: {
    22: actions.Split,
    20: actions.DontSplit,
    18: actions.Split,
    16: actions.Split,
    14: actions.Split,
    12: actions.Split,
    10: actions.DontSplit,
    8: actions.DontSplit,
    6: actions.Split,
    4: actions.Split,
  },
  5: {
    22: actions.Split,
    20: actions.DontSplit,
    18: actions.Split,
    16: actions.Split,
    14: actions.Split,
    12: actions.Split,
    10: actions.DontSplit,
    8: actions.DoubleAfterSplit,
    6: actions.Split,
    4: actions.Split,
  },
  6: {
    22: actions.Split,
    20: actions.DontSplit,
    18: actions.Split,
    16: actions.Split,
    14: actions.Split,
    12: actions.Split,
    10: actions.DontSplit,
    8: actions.DoubleAfterSplit,
    6: actions.Split,
    4: actions.Split,
  },
  7: {
    22: actions.Split,
    20: actions.DontSplit,
    18: actions.DontSplit,
    16: actions.Split,
    14: actions.Split,
    12: actions.DontSplit,
    10: actions.DontSplit,
    8: actions.DontSplit,
    6: actions.Split,
    4: actions.Split,
  },
  8: {
    22: actions.Split,
    20: actions.DontSplit,
    18: actions.Split,
    16: actions.Split,
    14: actions.DontSplit,
    12: actions.DontSplit,
    10: actions.DontSplit,
    8: actions.DontSplit,
    6: actions.DontSplit,
    4: actions.DontSplit,
  },
  9: {
    22: actions.Split,
    20: actions.DontSplit,
    18: actions.Split,
    16: actions.Split,
    14: actions.DontSplit,
    12: actions.DontSplit,
    10: actions.DontSplit,
    8: actions.DontSplit,
    6: actions.DontSplit,
    4: actions.DontSplit,
  },
  10: {
    22: actions.Split,
    20: actions.DontSplit,
    18: actions.DontSplit,
    16: actions.Split,
    14: actions.DontSplit,
    12: actions.DontSplit,
    10: actions.DontSplit,
    8: actions.DontSplit,
    6: actions.DontSplit,
    4: actions.DontSplit,
  },
  11: {
    22: actions.Split,
    20: actions.DontSplit,
    18: actions.DontSplit,
    16: actions.Split,
    14: actions.DontSplit,
    12: actions.DontSplit,
    10: actions.DontSplit,
    8: actions.DontSplit,
    6: actions.DontSplit,
    4: actions.DontSplit,
  },
};

const countLookup = ({ hands, playerValue, dealerFaceUp, trueCount }) => {
  // Illustrious 18

  if (dealerFaceUp.rank === ranks.Ace && trueCount >= 3) {
    return actions.Insurance;
  }
  if (playerValue === 16 && dealerFaceUp.value === 10 && trueCount >= 0) {
    return actions.Stand;
  }
  if (playerValue === 15 && dealerFaceUp.value === 10 && trueCount >= 4) {
    return actions.Stand;
  }
  if (hands.every((card) => card.value === 10) && dealerFaceUp.value === 5 && trueCount >= 5) {
    return actions.Split;
  }
  if (hands.every((card) => card.value === 10) && dealerFaceUp.value === 6 && trueCount >= 4) {
    return actions.Split;
  }
  if (playerValue === 10 && dealerFaceUp.value === 10 && trueCount >= 4) {
    return actions.Double;
  }
  if (playerValue === 12 && dealerFaceUp.value === 3 && trueCount >= 2) {
    return actions.Stand;
  }
  if (playerValue === 12 && dealerFaceUp.value === 2 && trueCount >= 3) {
    return actions.Stand;
  }
  if (playerValue === 11 && dealerFaceUp.value === 11 && trueCount >= 1) {
    return actions.Double;
  }
  if (playerValue === 9 && dealerFaceUp.value === 2 && trueCount >= 1) {
    return actions.Double;
  }
  if (playerValue === 10 && dealerFaceUp.value === 11 && trueCount >= 4) {
    return actions.Double;
  }
  if (playerValue === 9 && dealerFaceUp.value === 7 && trueCount >= 3) {
    return actions.Double;
  }
  if (playerValue === 16 && dealerFaceUp.value === 9 && trueCount >= 5) {
    return actions.Stand;
  }
  if (playerValue === 13 && dealerFaceUp.value === 2 && trueCount <= -1) {
    return actions.Hit;
  }
  if (playerValue === 12 && dealerFaceUp.value === 4 && trueCount <= 0) {
    return actions.Hit;
  }
  if (playerValue === 12 && dealerFaceUp.value === 5 && trueCount <= -2) {
    return actions.Hit;
  }
  if (playerValue === 12 && dealerFaceUp.value === 6 && trueCount <= -1) {
    return actions.Hit;
  }
  if (playerValue === 13 && dealerFaceUp.value === 3 && trueCount <= -2) {
    return actions.Hit;
  }

  // Fab 4 surrenders
  if (playerValue === 14 && dealerFaceUp.value === 10 && trueCount >= 3) {
    return actions.Surrender;
  }
  if (playerValue === 15 && dealerFaceUp.value === 10 && trueCount >= 0) {
    return actions.Surrender;
  }
  if (playerValue === 15 && dealerFaceUp.value === 9 && trueCount >= 2) {
    return actions.Surrender;
  }
  if (playerValue === 15 && dealerFaceUp.value === 11 && trueCount >= 1) {
    return actions.Surrender;
  }

  return null;
};

module.exports = {
  softLookup,
  hardLookup,
  splitLookup,
  countLookup,
};
