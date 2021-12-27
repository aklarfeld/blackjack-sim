const { hardLookup, softLookup, splitLookup } = require('./v1');
const { getValue } = require('../helper');
const actions = require('../actions');

const bookStrategy = ({ playerHand, dealerFaceUp }) => {
    if(playerHand.every(card => card.value === playerHand[0].value)) {
        const playerAction = splitLookup[dealerFaceUp.value][getValue(playerHand)];
        if(playerAction === actions.Split) { 
            return actions.Split;
        }
    }
    
    if(playerHand.length === 2 && playerHand.some(card => card.rank === 'Ace')) {
        return softLookup[dealerFaceUp.value][getValue(playerHand)]
    } else {
        return hardLookup[dealerFaceUp.value][getValue(playerHand)];
    }
    
}

module.exports = {
    bookStrategy
}