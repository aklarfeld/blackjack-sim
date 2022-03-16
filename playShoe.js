const parser = require('simple-args-parser');
const { getDeck, shuffleDeck } = require('./deck');
const { playHand, evaluateHands, debug, randomBetween } = require('./helper');
const { simpleStrategy, bookStrategy, hiLoCountingStrategy } = require('./strategies');

const playShoe = ({ numDecks, playerStrategy, dealerStrategy, countingStrategy }) => {
  debug('*** START SHOE ***');
  const decks = [...Array(numDecks).keys()].reduce(
    (combined) => [...combined, ...shuffleDeck(getDeck())],
    [],
  );
  const cutIndex = randomBetween(decks.length / 2, (decks.length * 3) / 4);
  let runningWin = 0;
  let handsPlayed = 0;
  let runningCount = 0;
  while (decks.length >= cutIndex) {
    const dealerFaceUp = decks.pop();
    const { hands: playerHands } = playHand({ strategy: playerStrategy, dealerFaceUp, decks });
    const { hands: dealerHands } = playHand({
      hands: [{ hands: [dealerFaceUp], bet: 1 }],
      strategy: dealerStrategy,
      dealerFaceUp,
      decks,
    });
    runningCount += dealerHands[0].hands.reduce(
      (count, card) => count + countingStrategy({ card }),
      0,
    );
    for (let i = 0; i < playerHands.length; i += 1) {
      runningWin += evaluateHands({ playerHand: playerHands[i], dealerHand: dealerHands[0] });
      runningCount += playerHands[i].hands.reduce(
        (count, card) => count + countingStrategy({ card }),
        0,
      );
    }
    debug('Dealer Initial', dealerFaceUp);
    debug('Player Hand', JSON.stringify(playerHands, null, 2));
    debug('Dealer Hand', JSON.stringify(dealerHands, null, 2));
    debug({ runningCount });
    handsPlayed += 1;
  }
  debug('*** END SHOE ***');
  return { win: runningWin, handsPlayed };
};

const monteCarloFullShoe = ({ simulateAmount, numDecks, playerStrategy, dealerStrategy }) => {
  let runningWin = 0;

  let totalHandsPlayed = 0;
  for (let i = 0; i < simulateAmount; i += 1) {
    const { win, handsPlayed } = playShoe({
      numDecks,
      playerStrategy,
      dealerStrategy,
      countingStrategy: hiLoCountingStrategy,
    });
    runningWin += win;
    totalHandsPlayed += handsPlayed;
  }
  console.log({
    runningWin,
    totalHandsPlayed,
    simulateAmount,
    winPerHand: runningWin / totalHandsPlayed,
  });
};

// Simulate basic strategy 10k times with 6 decks, where player hits until above 17
(function () {
  const args = parser.parse(process.argv, {
    long: ['simulateAmount:', 'numDecks:'],
    short: [],
    stupid: [],
  });
  monteCarloFullShoe({
    simulateAmount: args.simulateAmount || 1000,
    numDecks: args.numDecks || 6,
    playerStrategy: bookStrategy,
    dealerStrategy: simpleStrategy,
  });
})();
