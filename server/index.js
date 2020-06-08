const net = require("net");

let sockets = [];

let rooms = {};

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
            } else {
              rooms = {
                ...rooms,
                [details[1]]: {
                  min_bet: parseInt(details[2]),
                  game_started: false,
                  game_round: 1,
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
            if (rooms[details[1]]) {
              let players = rooms[details[1]].players;
              let bet = rooms[details[1]].min_bet;
              players.push({
                socket: socket,
                id: socketID,
                bet: bet
              });
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
