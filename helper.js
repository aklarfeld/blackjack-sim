const getValue = (cards) => {
    const values = [];
    const rawValue = cards.reduce((sum, card) => card.value + sum, 0);
    values.push(rawValue);
    if(cards.some(card => card.rank === 'Ace') && rawValue > 21) {
        values.push(rawValue - 10);
    }
    return values;
}

const getCount = (card) => {
    if(card.value <= 6) return 1;
    if(card.value <= 9 && card.value >= 7) return 0;
    if(card.value >= 10) return -1;
}

module.exports = {
    getValue,
    getCount,
}