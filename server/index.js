const net = require("net");

// constant for a deck of cards
const deck = [
  "1R",
  "2R",
  "3R",
  "4R",
  "5R",
  "6R",
  "7R",
  "8R",
  "9R",
  "10R",
  "11R",
  "12R",
  "13R",
  "1G",
  "2G",
  "3G",
  "4G",
  "5G",
  "6G",
  "7G",
  "8G",
  "9G",
  "10G",
  "11G",
  "12G",
  "13G",
  "1A",
  "2A",
  "3A",
  "4A",
  "5A",
  "6A",
  "7A",
  "8A",
  "9A",
  "10A",
  "11A",
  "12A",
  "13A",
  "1V",
  "2V",
  "3V",
  "4V",
  "5V",
  "6V",
  "7V",
  "8V",
  "9V",
  "10V",
  "11V",
  "12V",
  "13V"
];

// this will keep the clien sokets
let sockets = [];

// this will keep all the rooms
let rooms = {};

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
const getWinType = array => {
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

// function that "shuffles"/re-orders an array
// example:
// [1,2,3,4]
// // // => [3,1,4,2]
// [1,2,3,4]
// // // => [3,2,4,1]
// ...
const shuffle = array => {
  var ctr = array.length,
    temp,
    index;
  while (ctr > 0) {
    index = Math.floor(Math.random() * ctr);
    ctr--;
    temp = array[ctr];
    array[ctr] = array[index];
    array[index] = temp;
  }
  return array;
};

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

const getCards = (array, players) => {
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

console.log(getCards(shuffle(deck), 6));

//
// const start_game = (room) => {
//   setInterval(function(){
//     let players = rooms[room].players;
//     let cardsArray = getCards(shuffle(deck),players.length);
//
//   }.bind(room), 30000);
// }
//
// const server = net
//   .createServer(socket => {
//     let socketID = Math.random()
//       .toString()
//       .substring(2, 10);
//     sockets.push({
//       socket: socket,
//       id: socketID
//     });
//     socket.on("data", data => {
//       let message = data.toString();
//       let details = message.replace("\n", "").split(" ");
//       switch (details[0]) {
//         case "CREATE_ROOM":
//           try {
//             if (rooms[details[1]]) {
//               throw new Error("Room allready exists");
//             } else if (details[1] < 1) {
//               throw new Error("Cannot create room with less than 1 credit as min bet");
//             } else {
//               rooms = {
//                 ...rooms,
//                 [details[1]]: {
//                   min_bet: parseInt(details[2]),
//                   game_started: false,
//                   game_round: 1,
//                   players: []
//                 }
//               };
//               socket.write("OK\n");
//             }
//           } catch (e) {
//             socket.write("ERROR " + e + "\n");
//           }
//           break;
//         case "JOIN_ROOM":
//           try {
//             if (rooms[details[1]] === undefined) {
//               throw new Error("Room does not exist");
//             } else if (rooms[details[1]].players.length === 6) {
//               throw new Error("Room does not accept any more players");
//             } else {
//               let players = rooms[details[1]].players;
//               players.push({
//                 socket: socket,
//                 id: socketID,
//                 bet: 0
//               });
//               if (players.length > 1) {
//                 start_game(details[1]);
//               }
//               rooms = {
//                 ...rooms,
//                 [details[1]]: {
//                   ...rooms[details[1]],
//                   players: players
//                 }
//               };
//               socket.write("OK\n");
//             }
//           } catch (e) {
//             socket.write("ERROR " + e + "\n");
//           }
//           break;
//         case "LEAVE_ROOM":
//           try {
//             if (rooms[details[1]]) {
//               let players = rooms[details[1]].players.filter(
//                 item => item.id !== socketID
//               );
//               rooms = {
//                 ...rooms,
//                 [details[1]]: {
//                   ...rooms[details[1]],
//                   players: players
//                 }
//               };
//               socket.write("OK\n");
//             } else {
//               throw new Error("Room does not exist");
//             }
//           } catch (e) {
//             socket.write("ERROR " + e + "\n");
//           }
//           break;
//         case "BET":
//           try {
//             if (rooms[details[1]] === undefined) {
//               throw new Error("Room does not exist");
//             } else if (rooms[details[1]].min_bet > parseInt(details[2])) {
//               throw new Error("Number of credits is too small");
//             } else {
//               let players = rooms[details[1]].players.map(item => {
//                 if (item.id === socketID) {
//                   return {
//                     socket: socket,
//                     id: socketID,
//                     bet: parseInt(details[2])
//                   };
//                 } else {
//                   return item;
//                 }
//               });
//               rooms = {
//                 ...rooms,
//                 [details[1]]: {
//                   ...rooms[details[1]],
//                   players: players
//                 }
//               };
//               socket.write("OK\n");
//             }
//           } catch (e) {
//             socket.write("ERROR " + e + "\n");
//           }
//           break;
//         default:
//           break;
//       }
//     });
//   })
//   .on("error", err => {
//     console.log(err);
//   });
//
// server.listen(3000, () => {
//   console.log("opened server on", server.address().port);
// });
