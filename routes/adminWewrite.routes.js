const express = require('express');

const router = express.Router();

const {
    login,
    dashboard,
    questions,
    responses,
    resetPassword,
    analytics,
    sectorResponses,
    addQuestions,
    addAnswer,
    editQuestion,
    updateQuestion,
    deleteQuestion,
    enableQuestion,
    deleteAnswer,
    logout,
    disableQuestion,
} = require('../controllers/adminWewrite.controllers');

// Login
router.all('/login', login)

// Logout
router.get('/logout', logout)

// Dashboard
router.get('/dashboard', dashboard);

// Questions
router.get('/questions', questions);

// Add questions
router.all('/add-questions', addQuestions);

// Add questions
router.all('/add-answer', addAnswer);

// Edit Question
router.get('/edit-question/:id', editQuestion);

// Update Question
router.post('/update-question', updateQuestion);


// Delete Question
router.get('/delete-question/:id', deleteQuestion);

// Disable Question
router.get('/disable-question/:id', disableQuestion);


// Enable Question
router.get('/enable-question/:id', enableQuestion);

// Responses
router.get('/responses', responses);

// Password Reset
router.all('/password-reset', resetPassword);

// Analytics
router.get('/analytics', analytics);

// Sector Responses
router.get('/sector-responses', sectorResponses);



// Add answers
router.post('/add-answer', addAnswer);

// Delete Question
router.get('/delete-answer/:id', deleteAnswer);



module.exports = router;