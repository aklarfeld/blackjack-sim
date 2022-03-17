const R = require('ramda');
const {
  getPlayerCardsByValue,
  getDealerCardByValue,
  playHand,
  evaluateHands,
  getValue,
  makeDecks,
} = require('../helper');
const { makeCard, makeHand } = require('./fixtures');
const { bookStrategy } = require('../books');

describe('Helper functions operate correctly', () => {
  it('should generate the intended card by short name', () => {
    const card = makeCard('AC');
    expect(card.rank).toEqual('Ace');
    expect(card.value).toEqual(11);
    expect(card.suite).toEqual('Clubs');
  });

  it('should generate a deck correctly', () => {
    const deck = [...makeDecks(1)];
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
    const decks = [...makeDecks()];
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

  it('should NOT split the cards when the player is dealt two 6s and theres no double after split', () => {
    const playerHand = makeHand(['6S', '6H', '6D']);
    const dealerFaceUp = makeCard('2C');
    const decks = [...makeDecks()];
    const output = playHand({
      inputHands: [playerHand],
      dealerFaceUp: dealerFaceUp,
      strategy: bookStrategy,
      decks,
      canDoubleAfterSplit: false,
    });
    console.log(JSON.stringify(output, null, 2));
    expect(output.hands.length).toEqual(1);
  });

  it('should NOT split the cards when the player is dealt two 4s against a dealer 3', () => {
    const playerHand = makeHand(['4S', '4H']);
    const dealerFaceUp = makeCard('3C');
    const decks = [...makeDecks()];
    const output = playHand({
      inputHands: [playerHand],
      dealerFaceUp: dealerFaceUp,
      strategy: bookStrategy,
      decks,
    });
    expect(output.hands.length).toEqual(1);
  });

  it('should surrender with a 16 against a dealer Ace', () => {
    const playerHand = makeHand(['TS', '6H']);
    const dealerFaceUp = makeCard('AC');
    const decks = [...makeDecks()];
    const output = playHand({
      inputHands: [playerHand],
      dealerFaceUp: dealerFaceUp,
      strategy: bookStrategy,
      decks,
    });
    expect(output.hands[0].bet).toEqual(0.5);
  });

  it('should double the bet when the player is dealt an 11', () => {
    const playerHand = makeHand(['8S', '3H']);
    const dealerFaceUp = makeCard('4C');
    const decks = [...makeDecks()];
    const output = playHand({
      inputHands: [playerHand],
      dealerFaceUp: dealerFaceUp,
      strategy: bookStrategy,
      decks,
    });
    expect(output.hands[0].bet).toEqual(2);
  });

  it('should get player cards by value', () => {
    R.range(4, 22).forEach((value) => {
      const decks = [...makeDecks()];
      const { cards } = getPlayerCardsByValue({ inputValue: value, decks });
      expect(getValue(cards)).toEqual(expect.arrayContaining([value]));
      expect(decks.length).toEqual(52 * 6 - 2);
    });
  });

  it('should get dealer cards by value', () => {
    R.range(2, 11).forEach((value) => {
      const decks = [...makeDecks()];
      const { card } = getDealerCardByValue({ inputValue: value, decks });
      expect(getValue([card])).toEqual(expect.arrayContaining([value]));
      expect(decks.length).toEqual(52 * 6 - 1);
    });
  });

  it('should work', () => expect(true).toEqual(true));
});
