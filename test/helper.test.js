const R = require('ramda');
const {
  getPlayerCardsByValue,
  getDealerCardByValue,
  playHand,
  evaluateHands,
  getValue,
} = require('../helper');
const { getDeck } = require('../deck');
const { makeCard, makeHand, makeDecks } = require('./fixtures');
const { simpleStrategy, bookStrategy } = require('../strategies');

describe('Helper functions operate correctly', () => {
  it('should generate the intended card by short name', () => {
    const card = makeCard('AC');
    expect(card.rank).toEqual('Ace');
    expect(card.value).toEqual(11);
    expect(card.suite).toEqual('Clubs');
  });

  it('should generate a deck correctly', () => {
    const deck = getDeck();
    expect(deck.length).toEqual(52);
  });

  it('should evaluate hands correctly when the player wins', () => {
    const playerHand = makeHand(['AC', 'JC']);
    const dealerHand = makeHand(['8C', 'TC']);
    const win = evaluateHands({ playerHand, dealerHand });
    expect(win).toEqual(1);
  });

  it('should evaluate hands correctly when the player pushes', () => {
    const playerHand = makeHand(['TC', 'JC']);
    const dealerHand = makeHand(['QH', 'TH']);
    const win = evaluateHands({ playerHand, dealerHand });
    expect(win).toEqual(0);
  });

  it('should evaluate hands correctly when the player loses by busting', () => {
    const playerHand = makeHand(['4C', '8H', 'TS']);
    const dealerHand = makeHand(['2H', '3C']);
    const win = evaluateHands({ playerHand, dealerHand });
    expect(win).toEqual(-1);
  });

  it('should evaluate hands correctly when the player loses by busting but the dealer eventually busts too', () => {
    const playerHand = makeHand(['4C', '8H', 'TS']);
    const dealerHand = makeHand(['2H', '3C', 'TC', 'TS']);
    const win = evaluateHands({ playerHand, dealerHand });
    expect(win).toEqual(-1);
  });

  it('should evaluate hands correctly when the player loses by value', () => {
    const playerHand = makeHand(['AS', '8H', 'TS']);
    const dealerHand = makeHand(['JH', 'TC']);
    const win = evaluateHands({ playerHand, dealerHand });
    expect(win).toEqual(-1);
  });

  it('should split the cards when the player is dealt two 8s', () => {
    const playerHand = makeHand(['8S', '8H']);
    const dealerFaceUp = makeCard('4C');
    const decks = makeDecks();
    const output = playHand({
      inputHands: [playerHand],
      dealerFaceUp: dealerFaceUp,
      strategy: bookStrategy,
      decks,
    });
    // The player could pull another 8 which would cause
    // this to fail
    expect(output.hands.length).toBeGreaterThan(1);
  });

  it('should double the bet when the player is dealt an 11', () => {
    const playerHand = makeHand(['8S', '3H']);
    const dealerFaceUp = makeCard('4C');
    const decks = makeDecks();
    const output = playHand({
      inputHands: [playerHand],
      dealerFaceUp: dealerFaceUp,
      strategy: bookStrategy,
      decks,
    });
    expect(output.hands[0].bet).toEqual(2);
  });

  it('should get player cards by value', () => {
    R.range(2, 22).forEach((value) => {
      const decks = makeDecks();
      const { cards } = getPlayerCardsByValue({ inputValue: value, inputDecks: decks });
      expect(getValue(cards)).toEqual(expect.arrayContaining([value]));
    });
  });

  it('should get dealer cards by value', () => {
    R.range(2, 11).forEach((value) => {
      const decks = makeDecks();
      const { card } = getDealerCardByValue({ inputValue: value, inputDecks: decks });
      expect(getValue([card])).toEqual(expect.arrayContaining([value]));
    });
  });
});
