const parser = require('simple-args-parser');
const {
  playHand,
  evaluateHands,
  debug,
  randomBetween,
  getTrueCount,
  makeDecks,
} = require('./helper');
const { simpleStrategy, bookStrategy, hiLoCountingStrategy } = require('./books');

const playShoe = ({
  numDecks,
  playerStrategy,
  dealerStrategy,
  countingStrategy,
  isCardCountingActive = true,
}) => {
  debug('*** START SHOE ***');
  const decks = makeDecks(numDecks);
  const cutIndex = randomBetween(decks.length / 2, (decks.length * 3) / 4);
  let runningWin = 0;
  let handsPlayed = 0;
  let runningCount = 0;
  while (decks.length >= cutIndex) {
    const dealerFaceUp = decks.pop();
    const { hands: playerHands } = playHand({
      strategy: playerStrategy,
      dealerFaceUp,
      decks,
      trueCount: getTrueCount({ runningCount, decks }),
      isCardCountingActive,
    });
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
    simulateAmount: parseInt(args.simulateAmount, 10) || 1000,
    numDecks: parseInt(args.numDecks, 10) || 6,
    playerStrategy: bookStrategy,
    dealerStrategy: simpleStrategy,
  });
})();
