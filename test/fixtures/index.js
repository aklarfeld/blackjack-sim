const { ranks, suites, values, getDeck, shuffleDeck } = require('../../deck');

const flip = (obj) => Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));
const flippedSuites = flip(suites);
const flippedRanks = flip(ranks);

const makeCard = (shortName) => {
  const [rank, suite] = shortName.split('');
  return {
    rank: flippedRanks[rank],
    suite: flippedSuites[suite],
    name: shortName,
    value: values[flippedRanks[rank]],
  };
};

const makeHand = (shortNames, bet = 1) => ({
  hands: shortNames.map((name) => makeCard(name)),
  bet,
});

const makeDecks = (numDecks = 6) =>
  [...Array(numDecks).keys()].reduce((combined, d) => [...combined, ...shuffleDeck(getDeck())], []);

module.exports = { makeHand, makeCard, makeDecks };
