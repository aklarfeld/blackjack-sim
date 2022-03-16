const parser = require('simple-args-parser');
const { makeDecks } = require('./deck');
const {
  getPlayerCardsByValue,
  getDealerCardByValue,
  playHand,
  evaluateHands,
  debug,
} = require('./helper');
const { simpleStrategy, bookStrategy } = require('./strategies');
const { hardLookup, softLookup, splitLookup } = require('./books/v1');

const playSingleHand = ({ dealerValue, playerValue, forceSoft, forceSplit }) => {
  const inputDecks = makeDecks();
  const { cards, decks } = getPlayerCardsByValue({
    inputValue: playerValue,
    inputDecks,
    forceSoft,
    forceSplit,
  });
  const { card: dealerFaceUp, decks: decksToPlay } = getDealerCardByValue({
    inputValue: dealerValue,
    inputDecks: decks,
  });
  const { hands: playerHands } = playHand({
    inputHands: [{ hands: [...cards], bet: 1 }],
    dealerFaceUp,
    decks,
    strategy: bookStrategy,
  });
  const { hands: dealerHands } = playHand({
    inputHands: [{ hands: [dealerFaceUp], bet: 1 }],
    dealerFaceUp,
    decks: decksToPlay,
    strategy: simpleStrategy,
  });
  let win = 0;
  for (let i = 0; i < playerHands.length; i += 1) {
    win += evaluateHands({ playerHand: playerHands[i], dealerHand: dealerHands[0] });
  }

  debug('Initial Player Hand', JSON.stringify(cards, null, 2));
  debug('Dealer Face Up', JSON.stringify(dealerFaceUp, null, 2));
  debug('Player Hand', JSON.stringify(playerHands, null, 2));
  debug('Dealer Hand', JSON.stringify(dealerHands, null, 2));
  debug({ win, deckLength: decks.length });
  return win;
};

const monteCarloSingleHand = ({
  simulateAmount,
  dealerValue,
  playerValue,
  forceSoft = false,
  forceSplit = false,
}) => {
  let wins = 0;
  let losses = 0;
  for (let i = 0; i < simulateAmount; i += 1) {
    const outcome = playSingleHand({
      dealerValue,
      playerValue,
      forceSoft,
      forceSplit,
    });
    if (outcome < 0) {
      losses += 1;
    } else if (outcome > 0) {
      wins += 1;
    }
  }

  let bookAction;
  if (forceSoft) {
    bookAction = softLookup[dealerValue][playerValue];
  } else if (forceSplit) {
    bookAction = splitLookup[dealerValue][playerValue];
  } else {
    bookAction = hardLookup[dealerValue][playerValue];
  }

  console.log({
    wins,
    losses,
    simulateAmount,
    dealerValue,
    playerValue,
    forceSoft,
    forceSplit,
    ev: (wins + -1 * losses) / simulateAmount,
    bookAction,
  });
};

(function () {
  const args = parser.parse(process.argv, {
    long: ['simulateAmount:', 'dealerValue:', 'playerValue:', 'forceSoft', 'forceSplit'],
    short: [],
    stupid: [],
  });

  if (parseInt(args.dealerValue, 10) < 1 || parseInt(args.dealerValue, 10) > 11) {
    throw new Error('Dealer value must be between 1 and 11');
  }

  if (parseInt(args.playerValue, 10) < 2 || parseInt(args.playerValue, 10) > 21) {
    throw new Error('Player value must be between 2 and 21');
  }

  monteCarloSingleHand({
    simulateAmount: parseInt(args.simulateAmount, 10) || 1000,
    dealerValue: parseInt(args.dealerValue, 10),
    playerValue: parseInt(args.playerValue, 10),
    forceSoft: args.forceSoft,
    forceSplit: args.forceSplit,
  });
})();
