const db = require('../config/db');

class Question {
    constructor(question, required, responseType) {
        this.question = question;
        this.required = required;
        this.responseType = responseType;
    }

    // Fetch all questions
    static findAll() {
        let query = `SELECT * FROM questions WHERE status = 'ACTIVE';`

        return db.query(query);
    }
     // Fetch all questions for admins
     static adminFindAll() {
        let query = `SELECT * FROM questions;`

        return db.query(query);
    }

    // Fetch question by id
    static findOne (id) {
        let query = `SELECT * FROM questions WHERE id= ?;`

        return db.query(query, [id]);
    }

    // Get question by sector
    static getQuestionBySector(sectorId) {
        let query = `SELECT * FROM questions WHERE sectorId = ?;`

        return db.query(query, [sectorId]);
    }

    static getQuestionsByIds(sectorId, subSectorId) {
        let query = `SELECT * FROM questions WHERE sectorId = ? AND subSectorId = ?;`;

        return db.query(query, [sectorId, subSectorId]);
    }

    // Create question
    static save (question, required, responseType, sectorId, subSectorId) {
        let query = `INSERT INTO questions (question, required, responseType, sectorId, subSectorId) VALUES ( ?, ?, ?, ?, ?);`

        return db.query(query, [question, required, responseType, sectorId, subSectorId]);
    }

    // Update question
    static update (id, question, required, responseType, sectorId, subSectorId) {
        let query = `UPDATE questions SET question = ?, required = ?, responseType = ?, sectorId = ?, subSectorId = ? WHERE id = ?;`

        return db.query(query, [question, required, responseType, sectorId, subSectorId, id]);
    }

    // Delete question
    static delete (id) {
        let query = `DELETE FROM questions WHERE id = ?;`

        return db.query(query, [id]);
    }

    // Disable question
    static disable (id) {
        let query = `UPDATE questions SET status = 'DISABLED' WHERE id = ?;`

        return db.query(query, [id]);
    }

     // Enable question
     static enable (id) {
        let query = `UPDATE questions SET status = 'ACTIVE' WHERE id = ?;`

        return db.query(query, [id]);
    }
}

module.exports = Question;