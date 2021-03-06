const { ranks, suites, values } = require('../../deck');

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

module.exports = { makeHand, makeCard };
