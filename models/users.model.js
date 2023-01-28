const db = require("../config/db");

class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    // Get all users
    static findAll () {
        let query = `SELECT * FROM users;`

        return db.query(query);
    }

    // Create User
    static save (email, password, role) {
        let query = `INSERT INTO users (email, password, role) VALUES (?,?,?);`

        return db.query(query, [email, password, role]);
    }

    // Update
    static update (email, password) {
        let query = `UPDATE users SET password = ? WHERE email = ?;`

        return db.query(query, [password, email]);
    }

    // Get User by id
    static findById (id) {
        let query = `SELECT * FROM users WHERE id = ?;`

        return db.query(query, [id]);
    }

    // Get User by email
    static findByEmail (email) {
        let query = `SELECT * FROM users WHERE email = ?;`

        return db.query(query, [email]);
    }

    // Delete User
    static delete (id) {
        let query = `DELETE FROM users WHERE id = ?;`

        return db.query(query, [id]);
    }
}

module.exports = User;