// function that takes and array of 6 values,
// and returns the win type of those 6 values
// and the number of the win
// winType = 4 => 4 cards of the same
// winType = 3 => 3 cards of the same
// winType = 2 => 2 cards of the same
// winType = 0 => no cards of the same
// cardType = the highest card value pair or 0 if there is no winType
// example:
// getWinType([ '2V', '5G', '13R', '8V', '4A', '1A' ])
// // // // => cardType = 0; winType = 0
// getWinType([ '2R', '13A', '3R', '2G', '3G', '10R' ]);
// // // // => cardType = 3; winType = 2
// getWinType([ '2R', '9A', '12R', '2G', '11A', '10R' ]);
// // // // => cardType = 2; winType = 2
// getWinType([ '2R', '2A', '12R', '2G', '11A', '10R' ]);
// // // // => cardType = 2; winType = 3
// getWinType([ '2R', '2A', '2V', '2G', '11A', '10R' ]);
// // // // => cardType = 2; winType = 4
module.exports = array => {
  let simpleArray = array.map(item => parseInt(item.replace(/[RGAV]/g, "")));
  let numberOfCards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  simpleArray.forEach(item => {
    numberOfCards[item] = numberOfCards[item] + 1;
  });
  let winType = 0;
  let cardType = 0;
  numberOfCards.forEach((item, i) => {
    if (item > 1 && winType <= item) {
      winType = item;
      cardType = i;
    }
  });
  return {
    winType: winType,
    cardType: cardType
  };
};
