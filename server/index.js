const net = require("net");
// constant for a deck of cards
const deck = require("./deck.js");
// this will keep the clien sokets
let sockets = [];
// this will keep all the rooms
let rooms = {};
// function that "shuffles"/re-orders an array
const shuffle = require('./shuffle.js');
// function that returns an object containg players sub-arrays of 6 values
// along with the winning type and card winning number and the biggest win type
// and a number of those winners
const getCards = require("./get-cards.js");

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
