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

  static async joinGame(req, res) {
    const { username, gameId } = req.body;

    try {
      const gameExist = await UserGame.findOne({ where: { gameId } });

      if (!gameExist) {
        return res.status(404).json({
          message: "Game not found",
        });
      } else {
        const user = await User.create({ username });

        await UserGame.create({
          UserId: user.id,
          GameId: gameId,
          playerCards: [],
        });

        return res.status(201).json({
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
}

module.exports = { Controller };
