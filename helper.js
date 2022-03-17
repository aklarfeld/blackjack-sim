const R = require('ramda');
const { actions } = require('./actions');
const { ranks, suites, values } = require('./deck');

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const getTrueCount = ({ decks, runningCount }) => (runningCount * 1.0) / (decks.length / 52.0);

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffleDeck = (inputArray) => {
  const array = [...inputArray];
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};
const getDeck = () => {
  const deck = [];
  const suiteKeys = Object.keys(suites);
  const rankKeys = Object.keys(ranks);
  for (let i = 0; i < suiteKeys.length; i += 1) {
    for (let j = 0; j < rankKeys.length; j += 1) {
      const suite = suiteKeys[i];
      const rank = rankKeys[j];
      deck.push({ suite, rank, name: `${ranks[rank]}${suites[suite]}`, value: values[rank] });
    }
  }
  return deck;
};

const makeDecks = (numDecks = 6) =>
  [...Array(numDecks).keys()].reduce((combined) => [...combined, ...shuffleDeck(getDeck())], []);

const debug = (...params) => {
  if (process.argv.includes('--debug')) {
    console.log(params);
  }
};

const getValue = (cards) => {
  const vals = [];
  const rawValue = cards.reduce((sum, card) => card.value + sum, 0);
  const aces = cards.filter((card) => card.rank === 'Ace');
  vals.push(rawValue - aces.length * 10);

  // Only one ace is allowed to be worth 11
  if (aces.length && vals[0] + 10 <= 21) {
    vals.push(vals[0] + 10);
  }
  return vals;
};

const getCount = (card) => {
  if (card.value <= 6) return 1;
  if (card.value <= 9 && card.value >= 7) return 0;
  if (card.value >= 10) return -1;
  return 0;
};

const playHand = ({
  inputHands = [],
  dealerFaceUp,
  strategy,
  decks,
  trueCount,
  initialBet = 1,
  canDoubleAfterSplit = true,
}) => {
  let hands = [...inputHands];
  if (hands.length) {
    for (let i = 0; i < hands.length; i += 1) {
      while (hands[i].hands.length < 2) {
        hands[i].hands = [...hands[i].hands, decks.pop()];
      }
    }
  } else {
    hands = [{ hands: [decks.pop(), decks.pop()], bet: initialBet }];
  }

  const hasSplit = hands.length > 1;

  for (let i = 0; i < hands.length; i += 1) {
    const playerHand = hands[i];
    let playerAction = strategy({
      hands: playerHand.hands,
      dealerFaceUp,
      canDoubleAfterSplit,
      hasSplit,
      trueCount,
    });
    const playerValue = Math.min(...getValue(playerHand.hands));
    while (actions.Stand !== playerAction && playerValue < 21) {
      if (playerAction === actions.Hit) {
        playerHand.hands.push(decks.pop());
        playerAction = strategy({
          hands: playerHand.hands,
          dealerFaceUp,
          canDoubleAfterSplit,
          hasSplit,
          trueCount,
        });
      } else if (playerAction === actions.Surrender) {
        playerHand.bet *= 0.5;
        playerAction = actions.Stand;
      } else if (playerAction === actions.Double) {
        playerHand.hands.push(decks.pop());
        playerHand.bet *= 2;
        playerAction = actions.Stand;
      } else if (playerAction === actions.Split) {
        hands.push({ hands: [playerHand.hands.pop()], bet: initialBet });
        return playHand({
          inputHands: hands,
          dealerFaceUp,
          strategy,
          decks,
          bet: initialBet,
          canDoubleAfterSplit,
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

const getPlayerCardsByValue = ({
  inputValue,
  inputDecks,
  forceSplit = false,
  forceSoft = false,
}) => {
  const decks = [...inputDecks];
  let value = inputValue;

  // Two's and threes need an Ace, and Ace is 11 in the deck
  if (inputValue === 2) {
    value = 22;
  } else if (inputValue === 3) {
    value = 13;
  } else if (inputValue === 11) {
    value = 21;
  }

  const firstCardSearchStrategy = (card) => {
    if (forceSoft) {
      return card.value === value - 11;
    }
    if (forceSplit) {
      return card.value === value / 2;
    }

    // Default to split
    if ([4, 20, 22].includes(value)) {
      return card.value === value / 2;
    }

    // Default to soft
    if ([11, 21, 13].includes(value)) {
      return card.value === value - 11;
    }

    return value <= 10 ? card.value <= value / 2 : card.value > value / 2 && card.value !== 11;
  };

  const firstCardIndex = R.findIndex((card) => firstCardSearchStrategy(card), decks);
  const firstCard = decks[firstCardIndex];
  decks.splice(firstCardIndex, 1);
  const secondCardIndex = R.findIndex((card) => value - firstCard.value === card.value, decks);
  const secondCard = decks[secondCardIndex];
  decks.splice(secondCardIndex, 1);
  return { decks, cards: [firstCard, secondCard] };
};

const getDealerCardByValue = ({ inputValue, inputDecks }) => {
  const value = inputValue === 1 ? 11 : inputValue;
  const decks = [...inputDecks];
  const cardIndex = R.findIndex(R.propEq('value', value), decks);
  const card = decks[cardIndex];
  decks.splice(cardIndex, 1);
  return { card, decks };
};

module.exports = {
  getValue,
  getCount,
  getTrueCount,
  getPlayerCardsByValue,
  getDealerCardByValue,
  playHand,
  evaluateHands,
  debug,
  randomBetween,
  makeDecks,
};
