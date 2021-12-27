const getValue = (cards) => {
    const values = [];
    const rawValue = cards.reduce((sum, card) => card.value + sum, 0);
    values.push(rawValue);
    if(cards.some(card => card.rank === 'Ace') && rawValue > 21) {
        values.push(rawValue - 10);
    }
    return values;
}

module.exports = {
    getValue,
}