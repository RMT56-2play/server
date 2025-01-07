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

  static async createGame(req, res) {
    try {
      const game = await Game.create(req.body);
      res.status(201).json(game)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = { Controller };
