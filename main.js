const { getDeck, shuffleDeck } = require('./deck');
const { getValue, getPlayerCardsByValue, getDealerCardByValue } = require('./helper');
const { simpleStrategy } = require('./strategies');
const { actions } = require('./actions');

const NUM_DECKS = 6;

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const playShoe = (numDecks, playerStrategy, dealerStrategy, countingStrategy) => {
  console.log('*** START SHOE ***');
  const decks = [...Array(numDecks).keys()].reduce(
    (combined, d) => [...combined, ...shuffleDeck(getDeck())],
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
    for (let i = 0; i < playerHands.length; i++) {
      runningWin += evaluateHands({ playerHand: playerHands[i], dealerHand: dealerHands[0] });
      runningCount += playerHands[i].hands.reduce(
        (count, card) => (count += countingStrategy({ card })),
        0,
      );
    }
    console.log('Dealer Initial', dealerFaceUp);
    console.log('Player Hand', JSON.stringify(playerHands, null, 2));
    console.log('Dealer Hand', JSON.stringify(dealerHands, null, 2));
    console.log({ runningCount });
    handsPlayed += 1;
  }
  console.log('*** END SHOE ***');
  return { win: runningWin, handsPlayed };
};

const playHand = ({ hands = [], dealerFaceUp, strategy, decks }) => {
  if (hands.length) {
    for (let i = 0; i < hands.length; i++) {
      while (hands[i].hands.length < 2) {
        hands[i].hands = [...hands[i].hands, decks.pop()];
      }
    }
  } else {
    hands = [{ hands: [decks.pop(), decks.pop()], bet: 1 }];
    console.log('Player Initial', hands[0].hands);
  }

  for (let i = 0; i < hands.length; i++) {
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
          hands,
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
  if (dealerValue === playerValue) return 0;
};

// const testPlayHand = () => {
//     const decks = [...Array(6).keys()].reduce((combined, d) => [...combined, ...shuffleDeck(getDeck())], [])
//     const dealerFaceUp = decks.pop();
//     console.log('Dealer', dealerFaceUp)
//     const splits = [{ hands: [{ suite: 'Clubs', rank: 'Ace', name: 'AC', value: 11 }, { suite: 'Hearts', rank: 'Ace', name: 'AH', value: 11 }], bet: 1 }]
//     const { hands } = playHand({ hands: splits, dealerFaceUp, decks, strategy: bookStrategy });
//     console.log('Hands', hands.map(ph => ph.hands))
//     console.log('Finished hand');
// }

const testSingleHand = ({ dealerValue, playerValue, forceSoft, forceSplit }) => {
  const decks = [...Array(6).keys()].reduce(
    (combined, d) => [...combined, ...shuffleDeck(getDeck())],
    [],
  );
  const { cards } = getPlayerCardsByValue({
    value: playerValue,
    decks,
    forceSoft,
    forceSplit,
  });
  const { card: dealerFaceUp } = getDealerCardByValue({ value: dealerValue, decks });
  const { hands: playerHands } = playHand({
    hands: [{ hands: [...cards], bet: 1 }],
    dealerFaceUp,
    decks,
    strategy: bookStrategy,
  });
  const { hands: dealerHands } = playHand({
    hands: [{ hands: [dealerFaceUp], bet: 1 }],
    dealerFaceUp,
    decks,
    strategy: simpleStrategy,
  });
  let win = 0;
  for (let i = 0; i < playerHands.length; i++) {
    win += evaluateHands({ playerHand: playerHands[i], dealerHand: dealerHands[0] });
  }

  // console.log('Initial Player Hand', JSON.stringify(cards, null, 2));
  // console.log('Dealer Face Up', JSON.stringify(dealerFaceUp, null, 2));
  // console.log('Player Hand', JSON.stringify(playerHands, null, 2));
  // console.log('Dealer Hand', JSON.stringify(dealerHands, null, 2));
  // console.log({ win, deckLength: decks.length });
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
  for (let i = 0; i < simulateAmount; i++) {
    const outcome = testSingleHand({
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
  console.log({
    wins,
    losses,
    simulateAmount,
    dealerValue,
    playerValue,
    forceSoft,
    forceSplit,
    ev: (wins + -1 * losses) / simulateAmount,
  });
};

const monteCarloFullStrategy = ({ simulateAmount, numDecks, playerStrategy, dealerStrategy }) => {
  const losses = 0;
  const wins = 0;

  let totalHandsPlayed = 0;
  for (let i = 0; i < simulateAmount; i++) {
    const { win, handsPlayed } = playShoe(numDecks, playerStrategy, dealerStrategy);
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

console.log(playShoe(6, bookStrategy, simpleStrategy, hiLoCountingStrategy));

// Simulate basic strategy 10k times with 6 decks, where player hits until above 17

// monteCarloFullStrategy({ simulateAmount: 10000, numDecks: 1, playerStrategy: bookStrategy, dealerStrategy: simpleStrategy })
// testSingleHand({ dealerValue: 3, playerValue: 12 })

// 3 vs 12 : Hit -23.5%
// 2 vs 12 : Hit -25.7%

// 3 vs 13 : Stand -13.82%
// 2 vs 13 : Stand -17.8%

/* --------------------- */

// 3 vs 12 : Stand -13.1%
// 2 vs 12 : Stand  -17.9%

// 3 vs 13 : Hit -30.9%
// 2 vs 13 : Hit -32.3%

monteCarloSingleHand({
  simulateAmount: 1,
  dealerValue: 3,
  playerValue: 14,
  forceSoft: true,
});
