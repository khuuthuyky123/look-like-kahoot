const mongoose = require("mongoose");
const gameModel = require("../models/game.model");
const playerResultModel = require("../models/playerResult.model");

const createGame = async (req, res) => {
  const { quizId, isLive, playerList, playerResultList, pin } = req.body;
  try {
    const newGame = await gameModel.create({
      hostId: req.accessTokenPayload.userId,
      quizId,
      date: new Date().toISOString(),
      pin,
      isLive,
      playerList,
      playerResultList,
    });

    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getGames = async (req, res) => {
  try {
    const games = await gameModel.find();
    res.status(200).send(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGame = async (req, res) => {
  let game;
  try {
    game = await gameModel.findById(req.params.id);
    if (game == null) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGame = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No game with id: ${id}`);
  }

  try {
    await Game.findByIdAndRemove(id);
    res.json({ message: "Game deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGame = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No game with id: ${id}`);
  }

  const { hostId, quizId, pin, isLive, playerList, date } = req.body;

  const playerResultList = await playerResultModel.find({ gameId: id });
  console.log(playerResultList);
  try {
    const game = gameModel.create({
      _id: id,
      hostId,
      quizId,
      pin,
      isLive,
      playerList,
      date,
      playerResultList,
    });

    const updatedGame = await gameModel.findByIdAndUpdate(id, game, {
      new: true,
    });
    res.json(updatedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addPlayer = async (req, res) => {
  const { gameId } = req.params;
  const { playerId } = req.body;

  let game;
  try {
    game = await gameModel.findById(gameId);
    game.playerList.push(playerId);
    const updatedGame = await game.save();
    res.send(updatedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createGame,
  getGames,
  getGame,
  deleteGame,
  updateGame,
  addPlayer,
};
