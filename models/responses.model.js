const db = require('../config/db');

class Response {
    constructor(id, responses) {
        this.id = id;
        this.responses = responses;
    }


    // Fetch all responses
    static findAll () {
        let query = `SELECT * FROM responses;`;

        return db.query(query);
    }

    // Fetch by DESC
    static getDesc () {
        let query = `SELECT * FROM responses ORDER BY id DESC LIMIT 10;`

        return db.query(query);
    }

    // Fetch responses by sector
    static findBySector (sectorId) {
        let query = `SELECT * FROM responses WHERE q1 = ?;`; 
        return db.query(query, [sectorId]);
    }

    // Group by sectors
    // static groupBySector () {
    //     let query = `SELECT JSON_AGG();

    //     return db.query(query);
    // }

    // Fetch responses by sub-sector
    static findBySubSector (subSectorId) {
        let query = `SELECT * FROM responses WHERE responses->>"$.2" = ?;`;

        db.query(query, [subSectorId]);
    }

    // Fetch responses by sector
    static findByCompany (company) {
        let query = `SELECT * FROM responses WHERE responses->>"$.3" = ?;`;

        db.query(query, [company]);
    }

    // Add response
    static save (q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12) {
        let query = `INSERT INTO responses (q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`;

        db.query(query, [q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12]);
    }

    // Update response
    static update (id, responses) {
        let query = `UPDATE responses SET responses = ? WHERE id = ?;`;

        db.query(query, [responses, id]);
    }

    // Delete response
    static delete (id) {
        let query = `DELETE FROM responses WHERE id = ?;`;

        db.query(query, [id]);
    }


    // Fetch response in Months
    static getDataByMonth(){
        let query = `SELECT
        DATE_FORMAT(timestamp, '%m') AS month,
        COUNT(id) AS count
      FROM responses
      GROUP BY
        MONTH(timestamp),
        YEAR(timestamp);;`

        return db.query(query)
       
    }

    // Total responses by sector
    static getTotalBySector (sectorId) {
        let query = `SELECT COUNT(id) as count FROM responses WHERE q1 = ?;`; 
        return db.query(query, [sectorId]);
    }

      // Total responses
      static getTotalResponse () {
        let query = `SELECT COUNT(id) as count FROM responses`; 
        return db.query(query);
    }
       
}

module.exports = Response;