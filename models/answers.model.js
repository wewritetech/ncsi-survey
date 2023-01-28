const db = require('../config/db');

class Answer {
    constructor (value, label, type, questionId) {
        this.value = value;
        this.label = label;
        this.type = type;
        this.questionId = questionId;
    }

    // Get all answers
    static findAll () {
        let query = `SELECT value, label, type, questionId, sectorId, subSectorId FROM answers;`

        return db.query(query);
    }

    // Get answer by id
    static findOne (id) {
        let query = `SELECT * FROM answers WHERE id = ?;`

        return db.query(query, [id]);
    }

    // Get answer by questionId;
    static getAnswerByQuestionId (questionId) {
        let query = `SELECT * FROM answers WHERE questionId = ?;`;
        
        return db.query(query, [questionId]);
    }

    // Create answer
    static save (value, label, type, questionId, sectorId, subSectorId) {
        let query = `INSERT INTO answers (value, label, type, questionId, sectorId, subSectorId) VALUES ( ?, ?, ?, ?, ?, ?);`

        return db.query(query, [value, label, type, parseInt(questionId), sectorId, subSectorId]);
    }

    // Update answer
    static update(id, value, label, type, questionId) {
        let query = `UPDATE answers SET value = ?, label = ?, type = ?, questionId = ? WHERE id = ?`

        return db.query(query, [value, label, type, questionId, id]);
    }

    // Delete answer
    static delete (id) {
        let query = `DELETE FROM answers WHERE id = ?`

        return db.query(query, [id]);
    }
}

module.exports = Answer;