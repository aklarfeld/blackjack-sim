// Amazon book strategy

const { ranks } = require('../deck');
const { actions } = require('../actions');
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
    15: actions.Surrender,
    16: actions.Surrender,
    17: actions.Surrender, // Can stand?
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
    18: actions.Double, // Can Hit?
    19: actions.Stand,
    20: actions.Stand,
  },
  3: {
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Hit,
    16: actions.Hit,
    17: actions.Double,
    18: actions.Double, // Can Hit?
    19: actions.Stand,
    20: actions.Stand,
  },
  4: {
    13: actions.Hit,
    14: actions.Hit,
    15: actions.Double,
    16: actions.Double,
    17: actions.Double,
    18: actions.Double, // Can Hit?
    19: actions.Stand,
    20: actions.Stand,
  },
  5: {
    13: actions.Double,
    14: actions.Double,
    15: actions.Double,
    16: actions.Double,
    17: actions.Double,
    18: actions.Double, // Can Hit?
    19: actions.Stand,
    20: actions.Stand,
  },
  6: {
    13: actions.Double,
    14: actions.Double,
    15: actions.Double,
    16: actions.Double,
    17: actions.Double,
    18: actions.Double, // Can Hit?
    19: actions.Stand,
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
    20: actions.DontSplit, // Should actually default to other logic
    18: actions.Split,
    16: actions.Split,
    14: actions.Split,
    12: actions.Split, // Split only if double after
    10: actions.DontSplit,
    8: actions.DontSplit,
    6: actions.Split, // Split only if double after
    4: actions.Split, // Split only if double after
  },
  3: {
    22: actions.Split,
    20: actions.DontSplit, // Should actually default to other logic
    18: actions.Split,
    16: actions.Split,
    14: actions.Split,
    12: actions.Split,
    10: actions.DontSplit,
    8: actions.DontSplit,
    6: actions.Split, // Split only if double after
    4: actions.Split, // Split only if double after
  },
  4: {
    22: actions.Split,
    20: actions.DontSplit, // Should actually default to other logic
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
    20: actions.DontSplit, // Should actually default to other logic
    18: actions.Split,
    16: actions.Split,
    14: actions.Split,
    12: actions.Split,
    10: actions.DontSplit,
    8: actions.Split, // Split only if double after
    6: actions.Split,
    4: actions.Split,
  },
  6: {
    22: actions.Split,
    20: actions.DontSplit, // Should actually default to other logic
    18: actions.Split,
    16: actions.Split,
    14: actions.Split,
    12: actions.Split,
    10: actions.DontSplit,
    8: actions.Split, // Split only if double after
    6: actions.Split,
    4: actions.Split,
  },
  7: {
    22: actions.Split,
    20: actions.DontSplit, // Should actually default to other logic
    18: actions.DontSplit, // Should actually default to other logic
    16: actions.Split,
    14: actions.Split,
    12: actions.DontSplit,
    10: actions.DontSplit,
    8: actions.DontSplit, // Split only if double after
    6: actions.Split,
    4: actions.Split,
  },
  8: {
    22: actions.Split,
    20: actions.DontSplit, // Should actually default to other logic
    18: actions.Split, // Should actually default to other logic
    16: actions.Split,
    14: actions.DontSplit,
    12: actions.DontSplit,
    10: actions.DontSplit,
    8: actions.DontSplit, // Split only if double after
    6: actions.DontSplit,
    4: actions.DontSplit,
  },
  9: {
    22: actions.Split,
    20: actions.DontSplit, // Should actually default to other logic
    18: actions.Split, // Should actually default to other logic
    16: actions.Split,
    14: actions.DontSplit,
    12: actions.DontSplit,
    10: actions.DontSplit,
    8: actions.DontSplit, // Split only if double after
    6: actions.DontSplit,
    4: actions.DontSplit,
  },
  10: {
    22: actions.Split,
    20: actions.DontSplit, // Should actually default to other logic
    18: actions.DontSplit, // Should actually default to other logic
    16: actions.Split,
    14: actions.DontSplit,
    12: actions.DontSplit,
    10: actions.DontSplit,
    8: actions.DontSplit, // Split only if double after
    6: actions.DontSplit,
    4: actions.DontSplit,
  },
  11: {
    22: actions.Split,
    20: actions.DontSplit, // Should actually default to other logic
    18: actions.DontSplit, // Should actually default to other logic
    16: actions.Split,
    14: actions.DontSplit,
    12: actions.DontSplit,
    10: actions.DontSplit,
    8: actions.DontSplit, // Split only if double after
    6: actions.DontSplit,
    4: actions.DontSplit,
  },
};
// Splits

module.exports = {
  softLookup,
  hardLookup,
  splitLookup,
};
