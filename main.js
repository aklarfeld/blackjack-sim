const { getDeck, shuffleDeck } = require('./deck');
const { getValue } = require('./helper');
const { simpleStrategy } = require('./strategies');
const { actions } = require('./actions');

const NUM_DECKS = 6;

const randomBetween = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

const playShoe = (numDecks, playerStrategy, dealerStrategy) => {
    const decks = [...Array(numDecks).keys()].reduce((combined, d) => [...combined, ...shuffleDeck(getDeck())], [])
    const cutIndex = randomBetween(decks.length/2, decks.length * 3 / 4)
    let runningWin = 0;
    let handsPlayed = 0;
    while(decks.length >= cutIndex) {
        const dealerFaceUp = decks.pop()
        const { playerHands } = playPlayerHand({ playerStrategy, dealerFaceUp, decks });
        // const { playerValues: dealerValues, decks: decksAfterDealer } = dealerStrategy({ hand: dealerFaceUp, dealerFaceUp });
        // const dealerValue = dealerValues[0];
        // const resultingWin = evaluateHands({ playerValues, dealerValue });
        runningWin += resultingWin;
        runningDecks = deck;
        handsPlayed += 1;

    }
    return { win: runningWin, handsPlayed }
};

const playDealerHand = ({ dealerFaceUp }) => {

};

// [{ bet, hands }]
const playPlayerHand = ({ playerHands = [], dealerFaceUp, playerStrategy, decks }) => {
    if(playerHands.length) {
        for(let i=0; i<playerHands.length; i++) {
            const playerHand = playerHands[i].hand;
            while(playerHand.length < 2) {
                playerHands[i] = { hands: [...playerHand, decks.pop()], bet: 1 };
            }
        }
    } else {
        playerHands = [{ hands: [decks.pop(), decks.pop()], bet: 1 }];
    }

    for(let i=0; i<playerHands.length; i++) {
        const playerHand = playerHands[i]
        let playerAction = playerStrategy({ hands: playerHand.hands, dealerFaceUp });
        let playerValue = getValue(playerHand.hands); 
        console.log({ playerAction, playerValue })
        while(![actions.Stand, actions.Surrender].includes(playerAction) && playerValue < 21) {
            console.log({ playerAction, playerValue })
            if(playerAction === actions.Hit) {
                playerHand.hands.push(decks.pop());
                playerValue = getValue(playerHand.hands);
                playerAction = playerStrategy({ hands: playerHand.hands, dealerFaceUp });
            } else if (playerAction === actions.Double) {
                playerHand.hands.push(decks.push());
                playerValue = getValue(playerHand.hands);
                playerHand.bet = playerHands.bet * 2;
                playerAction = actions.Stand;
            } else if (playerAction === actions.Split) {
                playerHands.push(playerHand.pop());
                return playPlayerHand({ playerHands, dealerFaceUp, playerStrategy, decks });
            }
        }
    }
    return { playerHands }
}

const evaluateHands = ({ playerValues, dealerValue }) => playerValues.reduce((bet, playerValue) => {
    if(playerValue.value > 21) return bet - playerValue.bet;
    if(dealerValue.value > playerValue.value && dealerValue.value <= 21) return bet - playerValue.bet;
    if(playerValue.value < dealerValue.value && dealerValue.value > 21) return bet + playerValue.bet;
    if(dealerValue.value < playerValue.value) return bet + playerValue.bet;
    if(dealerValue.value === playerValue.value) return bet;
}, 0);

const testPlayPlayerHand = () => {
    const decks = [...Array(6).keys()].reduce((combined, d) => [...combined, ...shuffleDeck(getDeck())], [])
    const dealerFaceUp = [decks.pop()];
    console.log({ dealerFaceUp })
    const { playerHands } = playPlayerHand({ dealerFaceUp, decks, playerStrategy: simpleStrategy });
    console.log(JSON.stringify(playerHands, null, 2))
    console.log('Finished hand');
}

testPlayPlayerHand();

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

