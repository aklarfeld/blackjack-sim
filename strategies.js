const { actions } = require('./actions');
const { bookStrategy } = require('./books');
const { ranks } = require('./deck');
const { getDeck, shuffleDeck } = require('./deck');
const { getValue } = require('./helper');

// Dealer strategy
// Stand on soft 17
const simpleStrategy = ({ hands }) => {
    const maxPlayerValue = Math.max(...getValue(hands));
    const minPlayerValue = Math.min(...getValue(hands));
    const playerValue = maxPlayerValue > 21 ? minPlayerValue : maxPlayerValue;
    // Hit if the player value is less than 17
    if(playerValue < 17) {
        return actions.Hit;
    }
    else {
        return actions.Stand;
    }
}

module.exports = {
    simpleStrategy,
    bookStrategy,
}