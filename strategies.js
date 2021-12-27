const { actions } = require('./actions');
const { getBookAction } = require('./books');
const { ranks } = require('./deck');
const { getDeck, shuffleDeck } = require('./deck');
const { getValue } = require('./helper');

// Hit until you see 17, ignore dealer
// Also can be used for dealer strategy, standing on 17
// No splits, no doubles
const simpleStrategy = ({ hand, dealerFaceUp, decks }) => {
    const decksCopy = [...decks];
    const ongoingPlayerHand = [...hand];
    let playerValue = getValue(ongoingPlayerHand);
    // Hit if the player value is less than 17
    while(playerValue.some(value => value < 17)) {
        ongoingPlayerHand.push(decksCopy.pop());
        playerValue = getValue(ongoingPlayerHand);
    }
    return { decks: decksCopy, playerValues: [{ value: Math.max(...playerValue), bet: 1 }]}; 
}

const bookStrategy = ({ hand, dealerFaceUp, decks }) => {
    const decksCopy = [...decks];
    const ongoingPlayerHand = [...hand];

};

const testBookAction = () => {
    const decks = [...Array(6).keys()].reduce((combined, d) => [...combined, ...shuffleDeck(getDeck())], [])
    const playerHand = [decks.pop(), decks.pop()];
    const dealerFaceUpHand = [decks.pop()];
    console.log({ playerHand, dealerFaceUpHand, action: getBookAction({ playerHand, dealerFaceUpHand })})

}
testBookAction();

module.exports = {
    simpleStrategy,
}