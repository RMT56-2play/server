if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const port = 3000;

const app = express();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const router = require("./routers/index");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening to port http://localhost:${port}/`);
});

module.exports = app;
