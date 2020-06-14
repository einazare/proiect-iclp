// function that takes and array of 6 values,
// and returns the win type of those 6 values
// and the number of the win
const getWinType = require("./get-win-type.js");
// function that returns an object containg players sub-arrays of 6 values
// along with the winning type and card winning number and the biggest win type
// and a number of those winners
// example:
// getCards(
//   ["1R","2R","3R","4R","5R","6R","7R","8R","9R","10R","11R","12R","13R","1G","2G","3G","4G","5G","6G","7G","8G","9G","10G","11G","12G","13G","1A","2A","3A","4A","5A","6A","7A","8A","9A","10A","11A","12A","13A","1V","2V","3V","4V","5V","6V","7V","8V","9V","10V","11V","12V","13V"],
//   3
// );
// // // will return =>
// // // {
// // //   playerCards: [
// // //     { cards: ["1R", "2R", "3R", "4R", "5R", "6R"], winType: 0, cardType: 0 },
// // //     { cards: ["7R", "8R", "9R", "10R", "11R", "12R"], winType: 0, cardType: 0 },
// // //     { cards: ["13R", "1G", "2G", "3G", "4G", "5G"], winType: 0, cardType: 0 }
// // //   ],
// // //   biggestWin: {winType: 0, cardType: 0},
// // //   numberOfWinners: 0
// // // }

module.exports = (array, players) => {
  let cardsArray = [];
  let biggestWin = {
    winType: 0,
    cardType: 0
  };
  let numberOfWinners = 0;
  for (var i = 0; i < players; i++) {
    let playerCards = array.slice(players * i, players * i + 6);
    let winType = getWinType(playerCards);
    if (
      winType.winType !== 0 &&
      (winType.winType > biggestWin.winType ||
        (winType.winType === biggestWin.winType &&
          winType.cardType > biggestWin.cardType))
    ) {
      biggestWin = winType;
      numberOfWinners = 1;
    } else if (winType.winType !== 0 && (winType.winType === biggestWin.winType &&
      winType.cardType === biggestWin.cardType)) {
      numberOfWinners = numberOfWinners + 1;
    }
    cardsArray.push({
      cards: playerCards,
      ...winType
    });
  }
  return {
    playerCards: cardsArray,
    biggestWin: biggestWin,
    numberOfWinners: numberOfWinners
  };
};
