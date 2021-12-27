const { hardLookup, softLookup, splitLookup } = require('./v1');
const { getValue } = require('../helper')

const getBookAction = ({ playerHand, dealerFaceUpHand }) => {
    const dealerFaceUpCard = dealerFaceUpHand[0];
    if(playerHand.every(card => card.value === playerHand[0].value)) {
        return 'Unknown';
    }
    else if(playerHand.length === 2 && playerHand.some(card => card.rank === 'Ace')) {
        return softLookup[dealerFaceUpCard.value][getValue(playerHand)]
    } else {
        return hardLookup[dealerFaceUpCard.value][getValue(playerHand)];
    }
    
}

module.exports = {
    getBookAction
}