const { actions } = require('./actions');
const { bookStrategy } = require('./books');
const { ranks } = require('./deck');
const { getDeck, shuffleDeck } = require('./deck');
const { getValue } = require('./helper');

// Hit until you see 17, ignore dealer
// Also can be used for dealer strategy, standing on 17
// No splits, no doubles
const simpleStrategy = ({ hands }) => {
    let playerValue = getValue(hands);
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