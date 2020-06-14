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
// function that sets for each player its cards
// and it sends the message with the cards to each player
const setAndSendCards = room => {
  let roomObject = rooms[room];
  let players = roomObject.players;
  let minBet = roomObject.min_bet;
  let cardsArray = getCards(shuffle(deck),players.length);
  let playerCards = cardsArray.playerCards;
  let biggestWin = cardsArray.biggestWin;
  let numberOfWinners = cardsArray.numberOfWinners;
  let playersWithCards = []
  players.forEach((item, i) => {
    item.socket.write(
      "GAME STARTED "+room+" "+(item.bet === 0 ? minBet:item.bet)+" "+playerCards[i].cards.toString().replace(/,/g," ") + "\n"
    )
    // set for the player its cards and winType and cardType
    playersWithCards.push(
      {
        ...item,
        ...playerCards[i],
      }
    );
  });
  // set the new roomObjects with each players cards
  // and win types
  roomObject = {
    ...roomObject,
    biggestWin: biggestWin,
    numberOfWinners: numberOfWinners,
    players: playersWithCards
  };
  rooms[room] = roomObject;
}
// function that sends to each player
// if they won or lost the last round
// in the given room
const sendWinLost = room => {
  let roomObject = rooms[room];
  let minBet = roomObject.min_bet;
  let players = roomObject.players;
  let numberOfWinners = roomObject.numberOfWinners;
  let biggestWin = roomObject.biggestWin;
  let totalBet = 0;
  players.forEach(item => {
    if (true) {
      totalBet = totalBet + minBet;
    } else {
      totalBet = totalBet + item.bet;
    }
  });
  players.forEach(item => {
    if (item.winType === biggestWin.winType && item.cardType === biggestWin.cardType) {
      item.socket.write(
        "GAME_WON "+room+" "+totalBet/numberOfWinners+"\n"
      )
    } else {
      item.socket.write(
        "GAME_LOST "+room+" "+(item.bet === 0 ? minBet:item.bet)+"\n"
      )
    }
  });

}

const startGame = (room) => {
  let rounds = 0;
  // first round start
  // get cards for all the players
  // and send the cards to them
  setAndSendCards(room);
  let intervalID = setInterval(function(){
    rounds = rounds + 1;
    // send to each player if they won or lost
    // for the last round
    sendWinLost(room);
    if(rounds === 3) {
      // stop game
      clearInterval(intervalID);
      // and reset room - players need to enter the room again
      rooms[room] = {
        min_bet: rooms[room].min_bet,
        game_started: false,
        players: []
      }
    } else {
      // next round start if not round 4
      // get cards for all the players
      // and send the cards to them
      setAndSendCards(room);
    }
  }.bind(room), 30000);
}

const server = net
  .createServer(socket => {
    let socketID = Math.random()
      .toString()
      .substring(2, 10);
    sockets.push({
      socket: socket,
      id: socketID
    });
    socket.on("data", data => {
      let message = data.toString();
      let details = message.replace("\n", "").split(" ");
      switch (details[0]) {
        case "CREATE_ROOM":
          try {
            if (rooms[details[1]]) {
              throw new Error("Room allready exists");
            } else if (details[1] < 1) {
              throw new Error("Cannot create room with less than 1 credit as min bet");
            } else {
              rooms = {
                ...rooms,
                [details[1]]: {
                  min_bet: parseInt(details[2]),
                  game_started: false,
                  players: []
                }
              };
              socket.write("OK\n");
            }
          } catch (e) {
            socket.write("ERROR " + e + "\n");
          }
          break;
        case "JOIN_ROOM":
          try {
            if (rooms[details[1]] === undefined) {
              throw new Error("Room does not exist");
            } else if (rooms[details[1]].players.length === 6) {
              throw new Error("Room does not accept any more players");
            } else {
              let players = rooms[details[1]].players;
              players.push({
                socket: socket,
                id: socketID,
                bet: 0
              });
              if (players.length > 1 && !rooms[details[1]].game_started) {
                rooms[details[1]].game_started = true;
                startGame(details[1]);
              }
              rooms = {
                ...rooms,
                [details[1]]: {
                  ...rooms[details[1]],
                  players: players
                }
              };
              socket.write("OK\n");
            }
          } catch (e) {
            socket.write("ERROR " + e + "\n");
          }
          break;
        case "LEAVE_ROOM":
          try {
            if (rooms[details[1]]) {
              let players = rooms[details[1]].players.filter(
                item => item.id !== socketID
              );
              rooms = {
                ...rooms,
                [details[1]]: {
                  ...rooms[details[1]],
                  players: players
                }
              };
              socket.write("OK\n");
            } else {
              throw new Error("Room does not exist");
            }
          } catch (e) {
            socket.write("ERROR " + e + "\n");
          }
          break;
        case "BET":
          try {
            if (rooms[details[1]] === undefined) {
              throw new Error("Room does not exist");
            } else if (rooms[details[1]].min_bet > parseInt(details[2])) {
              throw new Error("Number of credits is too small");
            } else {
              let players = rooms[details[1]].players.map(item => {
                if (item.id === socketID) {
                  return {
                    socket: socket,
                    id: socketID,
                    bet: parseInt(details[2])
                  };
                } else {
                  return item;
                }
              });
              rooms = {
                ...rooms,
                [details[1]]: {
                  ...rooms[details[1]],
                  players: players
                }
              };
              socket.write("OK\n");
            }
          } catch (e) {
            socket.write("ERROR " + e + "\n");
          }
          break;
        default:
          break;
      }
    });
  })
  .on("error", err => {
    console.log(err);
  });

server.listen(3000, () => {
  console.log("opened server on", server.address().port);
});
