# Blackjack Odds Simulator

![Tests](https://github.com/aklarfeld/blackjack-sim/actions/workflows/tests.yaml/badge.svg)


## Simulate a full shoe

*Example:* 
```
yarn run shoe --simulateAmount 10000 --numDecks 6
```
| argument | description | 
| -------- | ----------- |
| `simulateAmount` | Number of times to run the Monte Carlo Simulation, defaults to 1000 | 
| `numDecks` | Number of decks to run in, defaults to 6 | 

## Simulate a single hand
```
yarn run hand --simulateAmount 100000 --dealerValue 3 --playerValue 12
```

| argument | description |
| -------- | ----------- |
| `simulateAmount` | Number of times to run the Monte Carlo Simulation, defaults to 1000 | 
| `dealerValue` | Value of the dealers up card, 1-11, where 11 is an Ace | 
| `playerValue` | Total value of the players initial two cards | 
| `forceSplit` | Force the players hand to be a split situation, e.g. when playerValue = 4, and `forceSplit` is set, the player will receive two 2's | 
| `forceSoft` | Force the players hand to be a soft version of the `playerValue`, e.g. when playerValue = 14, and `forceSoft` is set, the player will receive a 3 and an Ace | 

## TODO
- Argument Error Handling
- Figure out my expected value is working as anticipated, currently it is +/-1% of [this chart](https://wizardofodds.com/games/blackjack/appendix/9/6ds17r4/)
- Implement HiLo counting strategy and add it as a viable strategy on top of the book strategy
- Prettier Printing
- Implement DAS (Double after Split)

