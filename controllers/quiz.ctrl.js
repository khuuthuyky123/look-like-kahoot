const mongoose = require("mongoose");
const quizModel = require("../models/quiz.model");

const createQuiz = async (req, res) => {
  try {
    const {
      name,
      backgroundImage,
      description,
      // creatorName,
      pointsPerQuestion,
      // isPublic,
      // tags,
      // likesCount,
      questionList,
    } = req.body;
    const quiz = await quizModel.create({
      name,
      backgroundImage: backgroundImage || "",
      description: description || "",
      creatorId: req.accessTokenPayload.userId,
      // creatorName,
      pointsPerQuestion: pointsPerQuestion || 1,
      numberOfQuestions: questionList ? questionList.length : 0 ,
      // isPublic,
      // tags,
      // likesCount,
      questionList: questionList || [],
      dateCreated: new Date().toISOString(),
    });
console.log(quiz);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTeacherquizzes = async (req, res) => {
  let teacherId = req.accessTokenPayload.userId;
  console.log(teacherId);
  try {
    const quizzes = await quizModel.find({ creatorId: teacherId });
    res.status(200).send(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuiz = async (req, res) => {
  let quiz;
  try {
    quiz = await quizModel.findById(req.params.id);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No quiz with id: ${id}`);
  }

  try {
    await quizModel.findByIdAndRemove(id);
    res.json({ message: "Quiz deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuiz = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No quiz with id: ${id}`);
  }
  const  {
    name,
    backgroundImage,
    description,
    pointsPerQuestion,
    isPublic,
    tags,
    questionList,
  } = req.body;
  const quiz = {
    name,
    backgroundImage,
    description,
    pointsPerQuestion,
    isPublic,
    tags,
    questionList,
    numberOfQuestions: questionList ? questionList.length : 0 ,
  };

  try {
    const updatedQuiz = await quizModel.findByIdAndUpdate(id, quiz, { new: true });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addQuestion = async (req, res) => {
  const { quizId } = req.params;
  const {
    questionType,
    question,
    pointType,
    answerTime,
    answerList,
    questionIndex,
  } = req.body;

  try {
    var quiz = await quizModel.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    quiz.questionList.push({
      questionType,
      question,
      pointType,
      answerTime,
      answerList,
      questionIndex,
    });
    quiz.numberOfQuestions += 1;
    const updatedQuiz = await quiz.save();
    res.send(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getQuestions = async (req, res) => {
  const { quizId } = req.params;
  try {
    const quiz = await quizModel.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).send(quiz.questionList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  try {
    const quiz = await quizModel.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const question = quiz.questionList.id(questionId);
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(404).send(`No quiz with id: ${quizId}`);
  }
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send(`No question with id: ${questionId}`);
  }
  const quiz = await quizModel.findById(quizId);

  try {
    let questionIndex = quiz.questionList.findIndex(
      (obj) => obj._id == questionId
    );
    quiz.questionList.splice(questionIndex, 1);
    quiz.numberOfQuestions -= 1;
    await quizModel.findByIdAndUpdate(quizId, quiz, {
      new: true,
    });
    res.json({ message: "Question deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(404).send(`No quiz with id: ${quizId}`);
  }
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send(`No question with id: ${questionId}`);
  }

  const {
    questionType,
    question,
    pointType,
    answerTime,
    answerList,
    correctAnswersList,
  } = req.body;
  let quiz;

  try {
    quiz = await quizModel.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    let questionIndex = quiz.questionList.findIndex(
      (obj) => obj._id == questionId
    );
    quiz.questionList[questionIndex] = {
      _id: questionId,
      questionType,
      question,
      pointType,
      answerTime,
      answerList,
      correctAnswer,
      correctAnswersList,
    };
    const updatedQuiz = await quizModel.findByIdAndUpdate(quizId, quiz, {
      new: true,
    });
    res.send(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  getTeacherquizzes,
  getQuiz,
  deleteQuiz,
  updateQuiz,
  addQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
};
