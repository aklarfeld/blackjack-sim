const R = require('ramda');
const { actions } = require('./actions');

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const debug = (...params) => {
  if (process.argv.includes('--debug')) {
    console.log(params);
  }
};

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

const playHand = ({ inputHands = [], dealerFaceUp, strategy, decks }) => {
  let hands = [...inputHands];
  if (hands.length) {
    for (let i = 0; i < hands.length; i += 1) {
      while (hands[i].hands.length < 2) {
        hands[i].hands = [...hands[i].hands, decks.pop()];
      }
    }
  } else {
    hands = [{ hands: [decks.pop(), decks.pop()], bet: 1 }];
  }

  for (let i = 0; i < hands.length; i += 1) {
    const playerHand = hands[i];
    let playerAction = strategy({ hands: playerHand.hands, dealerFaceUp });
    let playerValue = Math.min(...getValue(playerHand.hands));
    while (actions.Stand !== playerAction && playerValue < 21) {
      if (playerAction === actions.Hit) {
        playerHand.hands.push(decks.pop());
        playerValue = Math.min(...getValue(playerHand.hands));
        playerAction = strategy({ hands: playerHand.hands, dealerFaceUp });
      } else if (playerAction === actions.Surrender) {
        playerHand.bet *= 0.5;
        playerAction = actions.Stand;
      } else if (playerAction === actions.Double) {
        playerHand.hands.push(decks.pop());
        playerValue = Math.min(...getValue(playerHand.hands));
        playerHand.bet *= 2;
        playerAction = actions.Stand;
      } else if (playerAction === actions.Split) {
        hands.push({ hands: [playerHand.hands.pop()], bet: 1 });
        return playHand({
          inputHands: hands,
          dealerFaceUp,
          strategy,
          decks,
        });
      }
    }
  }
  return { hands };
};

const evaluateHands = ({ playerHand, dealerHand }) => {
  const playerValue = Math.max(...getValue(playerHand.hands));
  const dealerValue = Math.max(...getValue(dealerHand.hands));
  if (playerHand.bet === 0.5) return -playerHand.bet; // Need to figure out a better way to detect surrenders
  if (playerValue > 21) return -playerHand.bet;
  if (dealerValue > playerValue && dealerValue <= 21) return -playerHand.bet;
  if (playerValue < dealerValue && dealerValue > 21) return playerHand.bet;
  if (dealerValue < playerValue) return playerHand.bet;
  return 0;
};

const getPlayerCardsByValue = ({ value, decks, forceSplit = false, forceSoft = false }) => {
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
  playHand,
  evaluateHands,
  debug,
  randomBetween,
};
