const Answer = require('../models/answers.model');

// Get all answers
const getAnswers = async (req, res) => {
    try {
        const [answers] = await Answer.findAll();

        res.status(200).json(answers);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

// Get answer by id
const getAnswerById = async (req, res) => {
    const {id} = req.params;

    try {
        const [answer] = await Answer.findOne(id);

        res.status(200).json(answer);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

// Add answer
const addAnswer = async (req, res) => {
    const { value, label, type, questionId} = req.body;

    try {
        const answer = await Answer.save(value, label, type, questionId);

        return res.status(201).json(answer)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

// Update answer
const updateAnswer = async (req, res) => {
    const {id} = req.params;
    const {value, label, type, questionId} = req.body;

    try {
        const answer = await Answer.update(id, value, label, type, questionId);

        res.status(200).json(answer);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

// Delete answer
const deleteAnswer = async (req, res) => {
    const {id} = req.params;

    try {
        const answer = Answer.delete(id);

        res.status(200).json({
            success: 'Deleted successfully'
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    getAnswers,
    getAnswerById,
    addAnswer,
    updateAnswer,
    deleteAnswer
}