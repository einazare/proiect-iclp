// with express
const express = require("express");
// const router = express.Router();
const bodyParser = require("body-parser");

const app = express();

// router.post("/", (req,res,next) => {
//   console.log(req.body);
// })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// api routes
app.post("/", (req,res,next) => {
  console.log(req);
  res.status(200).send("Recieved your request")
});

let port = 3000

// start server
const server = app.listen(port, function() {
  console.log("Server listening on port " + port);
});

// simple node
// const http = require('http');
//
// let server = http.createServer(function(req,res){
//   let url = req.url;
//   console.log();
//   res.writeHead(200, {"Content-Type": "text/plain"});
//   res.end("Hey ninjas");
// });
//
// server.listen(3000, "127.0.0.1");
//
// console.log("started server");
