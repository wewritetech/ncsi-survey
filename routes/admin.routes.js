const express = require('express');

const router = express.Router();

const {
    login,
    logout,
    dashboard,
    questions,
    responses,
    resetPassword,
    analytics,
    sectorResponses,
    editQuestion,
    updateQuestion, 
    enableQuestion,
    disableQuestion,
    addAnswer,
    deleteAnswer, 
} = require('../controllers/admin.controllers');

// Login
router.all('/login', login)

// Dashboard
router.get('/dashboard', dashboard);

// Questions
router.get('/questions', questions);


// Edit Question
router.get('/edit-question/:id', editQuestion);

// Update Question
router.post('/update-question', updateQuestion);

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

router.get('/logout', logout);



// Add answers
router.post('/add-answer', addAnswer);

// Delete Question
router.get('/delete-answer/:id', deleteAnswer);

 

module.exports = router;