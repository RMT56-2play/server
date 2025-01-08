const { User, Game, UserGame } = require("../models");

class Controller {
  static async getGame(req, res) {
    try {
      const game = await Game.findAll();
      console.log(game[0].deckCards[0][0]);
      res.status(200).json(game);
    } catch (error) {
      console.log(error);
    }
  }

  static shuffleCards() {
    const cardSets = [
      [0, 1, 2, 3, 4, 5, 6, 49],
      [7, 8, 9, 10, 11, 12, 13, 49],
      [49, 14, 15, 16, 17, 18, 19, 20],
      [49, 21, 22, 23, 24, 25, 26, 27],
      [32, 33, 34, 49, 28, 29, 30, 31],
      [35, 36, 37, 38, 39, 40, 41, 49],
      [42, 43, 44, 45, 46, 47, 48, 49],
      [0, 35, 7, 42, 14, 50, 21, 28],
      [1, 36, 8, 43, 15, 50, 22, 29],
      [2, 37, 9, 44, 16, 50, 23, 30],
      [3, 38, 10, 45, 17, 50, 24, 31],
      [32, 4, 39, 11, 50, 46, 18, 25],
      [33, 5, 40, 12, 47, 50, 19, 26],
      [34, 6, 41, 13, 48, 50, 20, 27],
      [0, 32, 48, 8, 16, 40, 51, 24],
      [1, 33, 41, 42, 17, 51, 9, 25],
      [34, 35, 10, 43, 2, 18, 51, 26],
      [51, 3, 36, 11, 44, 19, 27, 28],
      [4, 37, 12, 45, 51, 20, 21, 29],
      [5, 38, 13, 14, 51, 46, 22, 30],
      [6, 39, 7, 15, 51, 23, 47, 31],
      [0, 38, 9, 47, 18, 52, 27, 29],
      [1, 39, 10, 48, 19, 52, 21, 30],
      [2, 40, 42, 11, 20, 22, 52, 31],
      [32, 3, 41, 43, 12, 14, 52, 23],
      [33, 35, 4, 44, 13, 15, 52, 24],
      [34, 36, 5, 7, 45, 16, 52, 25],
      [37, 6, 8, 46, 17, 52, 26, 28],
      [0, 33, 36, 10, 46, 20, 53, 23],
      [1, 34, 37, 11, 14, 47, 53, 24],
      [2, 38, 12, 15, 48, 53, 25, 28],
      [3, 39, 42, 13, 16, 53, 26, 29],
      [4, 7, 40, 43, 17, 53, 27, 30],
      [5, 8, 41, 44, 18, 21, 53, 31],
      [32, 35, 6, 9, 45, 19, 53, 22],
      [0, 41, 11, 45, 15, 54, 26, 30],
      [1, 35, 12, 46, 16, 54, 27, 31],
      [32, 2, 36, 13, 47, 17, 21, 54],
      [33, 3, 37, 7, 48, 18, 22, 54],
      [34, 4, 38, 8, 42, 19, 54, 23],
      [5, 39, 9, 43, 20, 54, 24, 28],
      [6, 40, 10, 44, 14, 54, 25, 29],
      [0, 34, 39, 44, 12, 17, 22, 55],
      [1, 40, 55, 13, 45, 18, 23, 28],
      [2, 7, 41, 46, 19, 55, 24, 29],
      [3, 8, 47, 35, 20, 55, 25, 30],
      [4, 9, 14, 48, 55, 36, 26, 31],
      [32, 37, 10, 15, 55, 27, 42, 5],
      [33, 43, 38, 6, 11, 16, 21, 55],
      [0, 37, 43, 13, 19, 56, 25, 31],
      [32, 1, 38, 7, 44, 20, 56, 26],
      [33, 2, 39, 8, 45, 14, 56, 27],
      [34, 3, 40, 9, 46, 15, 21, 56],
      [4, 41, 10, 47, 16, 22, 56, 28],
      [35, 5, 11, 48, 17, 23, 56, 29],
      [36, 6, 42, 12, 56, 18, 24, 30],
    ];
    const shuffled = [...cardSets];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static async createGame(req, res) {
    try {
      const { username } = req.body;
      const user = await User.create({ username });
      const game = await Game.create({
        deckCards: Controller.shuffleCards(),
        status: "waiting",
      });
      const userGame = await UserGame.create({
        UserId: user.id,
        GameId: game.id,
        playerCards: [],
      });
      res.status(201).json({
        user: { id: user.id, username: user.username },
        game: { id: game.id, status: game.status },
        userGame: {
          id: userGame.id,
          UserId: userGame.UserId,
          GameId: userGame.GameId,
          playerCards: userGame.playerCards,
        },
        message: "Game created successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  static async joinGame(req, res) {
    const { username, gameId } = req.body;

    try {
      const game = await Game.findOne({ where: { id: gameId } });
      if (!game) {
        return res.status(404).json({
          message: "Game not found",
        });
      }
      if (game.status === "playing") {
        return res.status(400).json({
          message: "Game is already in progress",
        });
      } else if (game.status === "ended") {
        return res.status(400).json({
          message: "Game has ended",
        });
      }
      const players = await UserGame.findAll({ where: { GameId: gameId } });
      if (players.length > 4) {
        return res.status(400).json({
          message: "Game is full",
        });
      } else {
        const user = await User.create({ username });

        const userGame = await UserGame.create({
          UserId: user.id,
          GameId: gameId,
          playerCards: [],
        });

        return res.status(201).json({
          user: { id: user.id, username: user.username },
          game: { id: game.id, status: game.status },
          userGame: {
            id: userGame.id,
            UserId: userGame.UserId,
            GameId: userGame.GameId,
            playerCards: userGame.playerCards,
          },
          message: "User successfully joined the game",
        });
      }
    } catch (error) {
      console.error("Error joining game:", error);
      return res.status(500).json({
        message: "An error occurred while trying to join the game",
      });
    }
  }

  static async startGame(req, res) {
    try {
      const { gameId } = req.body;
      const game = await Game.findByPk(gameId);
      if (!game) {
        return res.status(404).json({
          message: "Game not found",
        });
      }
      if (game.status === "playing") {
        return res.status(400).json({
          message: "Game is already in progress",
        });
      } else if (game.status === "ended") {
        return res.status(400).json({
          message: "Game has ended",
        });
      }
      const players = await UserGame.findAll({ where: { GameId: gameId }, include: [{ model: User, attributes: ["username"] }]});
      if (players.length < 2) {
        return res.status(400).json({
          message: "Not enough players to start the game",
        });
      }
      const deckCards = [...game.deckCards];
      for (const player of players) {
        const topCard = deckCards.shift();
        var playerCards = player.dataValues.playerCards;
        playerCards.unshift(topCard);
        await UserGame.update(
          { playerCards: playerCards },
          { where: { UserId: player.id, GameId: gameId } }
        );
      }
      await Game.update(
        { deckCards: deckCards, status: "playing" },
        { where: { id: gameId } }
      );
      const currentGame = await Game.findByPk(gameId);
      const playerScores = players.map((player) => {
        return {
          username: player.dataValues.User.username,
          score: player.dataValues.playerCards.length, 
          playerCards: player.dataValues.playerCards,
        };
      });
      return res.status(200).json({
        players: playerScores, // Send player scores
        game: {
          deckCards: currentGame.deckCards,
          status: currentGame.status,
        },
        message: "Game started successfully",
      });
    } catch (error) {
      console.error("Error starting game:", error);
      return res.status(500).json({
        message: "An error occurred while trying to start the game",
      });
    }
  }

  static async action(req, res) {
    try {
      const { gameId, userId, imageId } = req.body;
      const game = await Game.findByPk(gameId);
      if (!game) {
        return res.status(404).json({
          message: "Game not found",
        });
      }
      if (game.status === "waiting") {
        return res.status(400).json({
          message: "Game has not started yet",
        });
      } else if (game.status === "ended") {
        return res.status(400).json({
          message: "Game has ended",
        });
      }
      const player = await UserGame.findOne({
        where: { UserId: userId, GameId: gameId },
        include: [{ model: User, attributes: ["username"] }],
      });
      if (!player) {
        return res.status(404).json({
          message: "Player not found",
        });
      }
      const playerCards = [...player.dataValues.playerCards];
      const deckCards = [...game.deckCards];
      const topCard = deckCards.shift();

      const imageIndexPlayer = playerCards[0].indexOf(Number(imageId));
      const imageIndexDeck = topCard.indexOf(Number(imageId));

      if (imageIndexDeck !== -1 && imageIndexPlayer !== -1) {
        playerCards.unshift(topCard);
        await UserGame.update(
          { playerCards: playerCards },
          { where: { UserId: userId, GameId: gameId } }
        );
        await Game.update({ deckCards: deckCards }, { where: { id: gameId } });
      } else {
        return res.status(400).json({
          message: "Image not matched",
        });
      }

      const currentGame = await Game.findByPk(gameId);
      if (currentGame.deckCards.length !== 0) {
        const players = await UserGame.findAll({
          where: { GameId: gameId },
          include: [{ model: User, attributes: ["username"] }],
        });
        const playerScores = players.map((player) => {
          return {
            username: player.dataValues.User.username,
            score: player.dataValues.playerCards.length,
            playerCards: player.dataValues.playerCards,
          };
        });
        return res.status(200).json({
          players: playerScores,
          game: {
            deckCards: currentGame.deckCards,
            status: currentGame.status,
          },
          message: `${player.dataValues.User.username} gets the card (+1pt)`,
        });
      } else {
        Controller.endGame(req, res);
      }
    } catch (error) {
      console.error("Error performing action:", error);
      return res.status(500).json({
        message: "An error occurred while trying to perform the action",
      });
    }
  }

  static async endGame(req, res) {
    try {
      const { gameId } = req.body;
      const game = await Game.findByPk(gameId);
      if (!game) {
        return res.status(404).json({
          message: "Game not found",
        });
      }
      if (game.status === "waiting") {
        return res.status(400).json({
          message: "Game has not started yet",
        });
      } else if (game.status === "ended") {
        return res.status(400).json({
          message: "Game has already ended",
        });
      }
      const players = await UserGame.findAll({
        where: { GameId: gameId },
        include: [{ model: User, attributes: ["username"] }],
      });
      const playerScores = players.map((player) => {
        return {
          username: player.dataValues.User.username,
          score: player.dataValues.playerCards.length,
        };
      });
      await Game.update({ status: "ended" }, { where: { id: gameId } });
      return res.status(200).json({
        playerScores: playerScores,
        message: "Game ended successfully",
      });
    } catch (error) {
      console.error("Error ending game:", error);
      return res.status(500).json({
        message: "An error occurred while trying to end the game",
      });
    }
  }
}

module.exports = { Controller };
