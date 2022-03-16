const R = require('ramda');

const getValue = (cards) => {
  const values = [];
  const rawValue = cards.reduce((sum, card) => card.value + sum, 0);
  const aces = cards.filter((card) => card.rank === 'Ace');
  values.push(rawValue - aces.length * 10);

  // Only one ace is allowed to be worth 11
  if (aces.length && values[0] + 10 <= 21) {
    values.push(values[0] + 10);
  }
  return values;
};

const getCount = (card) => {
  if (card.value <= 6) return 1;
  if (card.value <= 9 && card.value >= 7) return 0;
  if (card.value >= 10) return -1;
  return 0;
};

const getPlayerCardsByValue = ({ value, decks, forceSplit = false, forceSoft = false }) => {
  // if(value === 21 && !forceSoft) {
  //     throw new Error('Can not use 21 without "forceSoft" = true')
  // }

  // if(value === 20 && !forceSplit) {
  //     throw new Error('Can not use 20 without "forceSplit" = true')
  // }

  const firstCardSearchStrategy = (card) => {
    if (forceSoft) {
      return card.value === value - 11;
    }
    if (forceSplit) {
      return card.value === value / 2;
    }
    return card.value > value / 2 && card.value !== 11;
  };

  const firstCardIndex = R.findIndex((card) => firstCardSearchStrategy(card), decks);
  const firstCard = decks[firstCardIndex];
  decks.splice(firstCardIndex, 1);
  const secondCardIndex = R.findIndex((card) => value - firstCard.value === card.value, decks);
  const secondCard = decks[secondCardIndex];
  decks.splice(secondCardIndex, 1);
  return { cards: [firstCard, secondCard] };
};

const getDealerCardByValue = ({ value, decks }) => {
  const cardIndex = R.findIndex(R.propEq('value', value), decks);
  const card = decks[cardIndex];
  decks.splice(cardIndex, 1);
  return { card };
};

module.exports = {
  getValue,
  getCount,
  getPlayerCardsByValue,
  getDealerCardByValue,
};
