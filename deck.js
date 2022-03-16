const suites = {
  Spades: 'S',
  Diamonds: 'D',
  Clubs: 'C',
  Hearts: 'H',
};

const ranks = {
  Two: '2',
  Three: '3',
  Four: '4',
  Five: '5',
  Six: '6',
  Seven: '7',
  Eight: '8',
  Nine: '9',
  Ten: 'T',
  Jack: 'J',
  Queen: 'Q',
  King: 'K',
  Ace: 'A',
};

const values = {
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Ten: 10,
  Jack: 10,
  Queen: 10,
  King: 10,
  Ace: 11,
};

const getDeck = () => {
  const deck = [];
  const suiteKeys = Object.keys(suites);
  const rankKeys = Object.keys(ranks);
  for (let i = 0; i < suiteKeys.length; i += 1) {
    for (let j = 0; j < rankKeys.length; j += 1) {
      const suite = suiteKeys[i];
      const rank = rankKeys[j];
      deck.push({ suite, rank, name: `${ranks[rank]}${suites[suite]}`, value: values[rank] });
    }
  }
  return deck;
};

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffleDeck = (inputArray) => {
  const array = [...inputArray];
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

module.exports = {
  getDeck,
  shuffleDeck,
  ranks,
  suites,
  values,
};
