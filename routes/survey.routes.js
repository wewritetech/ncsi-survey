const express = require('express');

const router = express.Router();

const {
    page1,
    page2,
    page3,
    page4,
    page3Alt,
    submit,
    Welcome,
} = require('../controllers/survey.controllers');

// Submit all response
router.all('/', Welcome);


// Page 1 (Sector, Sub-Sector, Company)
router.all('/page1', page1);

// Page 2 (Main Questions)
router.all('/page2', page2);
// router.post('/page2')

// Page 3 (Main Questions)
router.all('/page3', page3);

// Page 4 (Main Questions)
router.all('/page4', page4);

// page3Alt (Main Questions)
router.all('/page3Alt/:sectorID', page3Alt);


// Submit all response
router.all('/submit', submit);


module.exports = router;