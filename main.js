const { getDeck, shuffleDeck } = require('./deck');
const { simpleStrategy } = require('./strategies');
const NUM_DECKS = 6;

const randomBetween = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

const playShoe = (numDecks, playerStrategy, dealerStrategy) => {
    const decks = [...Array(numDecks).keys()].reduce((combined, d) => [...combined, ...shuffleDeck(getDeck())], [])
    const cutIndex = randomBetween(decks.length/2, decks.length * 3 / 4)
    let runningWin = 0;
    let runningDecks = [...decks];
    let handsPlayed = 0;
    while(runningDecks.length >= cutIndex) {
        const { resultingWin, deck } = playHand(playerStrategy, dealerStrategy, runningDecks);
        runningWin += resultingWin;
        runningDecks = deck;
        handsPlayed += 1;
    }
    return { win: runningWin, handsPlayed }
};

const playHand = (playerStrategy, dealerStrategy, inputDecks) => {
    const ongoingDecks = [...inputDecks];
    const playerHand = [ongoingDecks.pop(), ongoingDecks.pop()];
    const dealerFaceUp = [ongoingDecks.pop()];
    const { playerValues, decks: decksAfterPlayer } = playerStrategy({ hand: playerHand, dealerFaceUp, decks: ongoingDecks });
    const { playerValues: dealerValues, decks: decksAfterDealer } = dealerStrategy({ hand: dealerFaceUp, dealerFaceUp, decks: decksAfterPlayer });
    const dealerValue = dealerValues[0];
    const resultingWin = evaluateHands({ playerValues, dealerValue });
    return { resultingWin, deck: decksAfterDealer }
}

const evaluateHands = ({ playerValues, dealerValue }) => playerValues.reduce((bet, playerValue) => {
    if(playerValue.value > 21) return bet - playerValue.bet;
    if(dealerValue.value > playerValue.value && dealerValue.value <= 21) return bet - playerValue.bet;
    if(playerValue.value < dealerValue.value && dealerValue.value > 21) return bet + playerValue.bet;
    if(dealerValue.value < playerValue.value) return bet + playerValue.bet;
    if(dealerValue.value === playerValue.value) return bet;
}, 0);

const monteCarlo = ({ simulateAmount, numDecks, playerStrategy, dealerStrategy }) => {
    let runningWin = 0;
    let totalHandsPlayed = 0;
    for(let i=0; i<simulateAmount; i++) {
        const { win, handsPlayed } = playShoe(numDecks, playerStrategy, dealerStrategy);
        runningWin += win;
        totalHandsPlayed += handsPlayed;
    }
    console.log({ runningWin, totalHandsPlayed, simulateAmount, winPerHand: runningWin / totalHandsPlayed })
}
// Simulate basic strategy 10k times with 6 decks, where player hits until above 17
// monteCarlo({ simulateAmount: 10000, numDecks: 6, playerStrategy: simpleStrategy, dealerStrategy: simpleStrategy })

