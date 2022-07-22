const express = require("express")
const router = express.Router()

const {
  createGame,
  getGames,
  getGame,
  updateGame,
  deleteGame,
  addPlayer,
} = require("../controllers/game.ctrl")

router.get("/",getGames)
router.post("/",createGame)

router.patch("/:gameId/players",addPlayer)


router.get("/:id",getGame)
router.patch("/:id",updateGame)
router.delete("/:id",deleteGame)

module.exports = router
