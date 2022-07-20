const express = require("express");
const router = express.Router();

const {
  createQuiz,
  getTeacherquizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
} = require("../controllers/quiz.ctrl");

router.post('/',createQuiz);

router.get("/teacher/:teacherId", getTeacherquizzes)

router.get("/:id",getQuiz)
router.patch("/:id",updateQuiz)
router.delete("/:id",deleteQuiz);

router.post('/:quizId/questions',addQuestion)
router.get('/:quizId/questions',getQuestions);

router.get('/:quizId/questions/:questionId',getQuestion)
router.patch('/:quizId/questions/:questionId',updateQuestion)
router.delete('/:quizId/questions/:questionId',deleteQuestion)

module.exports = router;
