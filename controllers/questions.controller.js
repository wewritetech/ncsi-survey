const db = require('../config/db');
const Question = require('../models/questions.model');
const Answer = require('../models/answers.model');

// Get all questions
const getQuestionsWithAnswers = async () => {
    const [questions, _] = await Question.findAll();
    const [answers] = await Answer.findAll();

    let data = [];
    questions.forEach(question => {
        answers.forEach(answer => {
            if (question.id === answer.questionId) {
                data.push(answer)

                let result = JSON.stringify(data);
                result = JSON.parse(result)
                let sortedResult = []
                result.forEach(result => {
                    if (result['questionId'] === question.id) {
                        sortedResult.push(result)
                        question['answers'] = sortedResult;
                    }
                });
            }
        });
    });

    return questions;
}

// Get question by id
const getQuestionById = async (req, res) => {
    const {id} = req.params;

    try {
        const [question] = await Question.findOne(id);

        res.status(200).json(question);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

// Add question
const addQuestion = async (req, res) => {
    const {question, required, responseType, subSectorId} = req.body;

    try {
        const query = await Question.save(question, required, responseType, subSectorId);

        res.status(201).json(query)
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

//Update question
const updateQuestion = async (req, res) => {
    const {id} = req.params;
    const {question, required, responseType, subSectorId} = req.body;

    try {
        const query = await Question.update(id, question, required, responseType, subSectorId);
        
        res.status(200).json(query);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

// Delete question
const deleteQuestion = (req, res) => {
    const {id} = req.params;

    try {
        const question = Question.delete(id);

        res.status(200).json({
            success: 'Deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    getQuestionsWithAnswers,
    getQuestionById,
    addQuestion,
    updateQuestion,
    deleteQuestion
}