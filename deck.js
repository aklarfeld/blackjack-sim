const suites = {
  Spades: 'S',
  Diamonds: 'D',
  Clubs: 'C',
  Hearts: 'H',
};

const ranks = {
  Two: '2',
  Three: '3',
  Four: '4',
  Five: '5',
  Six: '6',
  Seven: '7',
  Eight: '8',
  Nine: '9',
  Ten: 'T',
  Jack: 'J',
  Queen: 'Q',
  King: 'K',
  Ace: 'A',
};

const values = {
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Ten: 10,
  Jack: 10,
  Queen: 10,
  King: 10,
  Ace: 11,
};

module.exports = {
  ranks,
  suites,
  values,
};
