const { getDeck, shuffleDeck } = require('./deck');
const { getValue } = require('./helper');
const { simpleStrategy } = require('./strategies');
const { actions } = require('./actions');
const { bookStrategy } = require('./books');

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
        const { hands: playerHands } = playHand({ strategy: playerStrategy, dealerFaceUp, decks });
        const { hands: dealerHands } = playHand({ hands: [{ hands: [dealerFaceUp], bet: 1 }], strategy: dealerStrategy, dealerFaceUp, decks });
        for(let i=0; i < playerHands.length; i++) {
            runningWin += evaluateHands({ playerHand: playerHands[i], dealerHand: dealerHands[0] });
        }
        console.log('Dealer Initial', dealerFaceUp);
        console.log('Player Hand', JSON.stringify(playerHands, null, 2));
        console.log('Dealer Hand', JSON.stringify(dealerHands, null, 2));
        console.log({ runningWin })
        process.exit(0)
        // runningWin += resultingWin;
        // runningDecks = deck;
        // handsPlayed += 1;
    }
    // return { win: runningWin, handsPlayed }
};

const playHand = ({ hands = [], dealerFaceUp, strategy, decks }) => {
    if(hands.length) {
        for(let i=0; i<hands.length; i++) {
            while(hands[i].hands.length < 2) {
                hands[i].hands = [...hands[i].hands, decks.pop()];
            }
        }
    } else {
        hands = [{ hands: [decks.pop(), decks.pop()], bet: 1 }];
        console.log('Player Initial', hands[0].hands);
    }

    for(let i=0; i<hands.length; i++) {
        const playerHand = hands[i]
        let playerAction = strategy({ hands: playerHand.hands, dealerFaceUp });
        let playerValue = Math.min(...getValue(playerHand.hands));
        while(actions.Stand !== playerAction && playerValue < 21) {
            if(playerAction === actions.Hit) {
                playerHand.hands.push(decks.pop());
                playerValue = Math.min(...getValue(playerHand.hands));
                playerAction = strategy({ hands: playerHand.hands, dealerFaceUp });
            } else if (playerAction === actions.Surrender) {
                playerHand.bet = playerHand.bet * 0.5;
                playerAction = actions.Stand;
            }
            else if (playerAction === actions.Double) {
                playerHand.hands.push(decks.pop());
                playerValue = Math.min(...getValue(playerHand.hands));
                playerHand.bet = playerHand.bet * 2;
                playerAction = actions.Stand;
            } else if (playerAction === actions.Split) {
                hands.push({ hands: [playerHand.hands.pop()], bet: 1 });
                return playHand({ hands, dealerFaceUp, strategy, decks });
            }
        }
    }
    return { hands: hands }
}

const evaluateHands = ({ playerHand, dealerHand }) => {
    const playerValue = Math.max(...getValue(playerHand.hands));
    const dealerValue = Math.max(...getValue(dealerHand.hands));
    if(playerHand.bet === 0.5) return -playerHand.bet;
    if(playerValue > 21) return -playerHand.bet;
    if(dealerValue > playerValue && dealerValue <= 21) return -playerHand.bet;
    if(playerValue < dealerValue && dealerValue > 21) return playerHand.bet;
    if(dealerValue < playerValue) return playerHand.bet;
    if(dealerValue === playerValue) return 0;
}

const testPlayHand = () => {
    const decks = [...Array(6).keys()].reduce((combined, d) => [...combined, ...shuffleDeck(getDeck())], [])
    const dealerFaceUp = decks.pop();
    console.log('Dealer', dealerFaceUp)
    const splits = [{ hands: [{ suite: 'Clubs', rank: 'Ace', name: 'AC', value: 11 }, { suite: 'Hearts', rank: 'Ace', name: 'AH', value: 11 }], bet: 1 }]
    const { hands } = playHand({ hands: splits, dealerFaceUp, decks, strategy: bookStrategy });
    console.log('Hands', hands.map(ph => ph.hands))
    console.log('Finished hand');
}

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

playShoe(6, bookStrategy, simpleStrategy)
// Simulate basic strategy 10k times with 6 decks, where player hits until above 17
// monteCarlo({ simulateAmount: 10000, numDecks: 6, playerStrategy: simpleStrategy, dealerStrategy: simpleStrategy })

