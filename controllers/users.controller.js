const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const User = require('../models/users.model');

// Get all users
const getUsers = async (req, res) => {
    try {
        const [users] = await User.findAll()

        return res.status(200).json(users)
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

// Get user by id
const getUserById = async (req, res) => {
    const {id} = req.params;

    try {
        const [user] = await User.findById(id);

        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
    
}

// Add user
const addUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const [userExists] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);

        console.log(userExists);
        if (email == '' || email == null) {
            return res.status(400).json({
                error: 'Email is required'
            });
        }

        else if (password == '' || password == null) {
            return res.status(400).json({
                error: 'Password is required'
            });
        }

        else if (userExists.length > 0) {
            return res.status(400).json({
                error: 'Email already in use'
            });
        }

        else if (!validator.isEmail(email)) {
            return res.status(400).json({
                error: 'Email is invalid'
            });
        }

        else if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters, must include at least an uppercase letter, a number and a symbol'
            });
        }

        else {
            const user = await User.save(email, await bcrypt.hash(password, 12));

            return res.status(201).json(user);
        }

    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

// Update user
const updateUser = (req, res) => {
  
}

// Delete user
const deleteUser = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await User.delete(id);

        return res.status(200).json({
            success: 'Deleted succesfully...'
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

// Login
const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const [user, _] = await User.findByEmail(email);

        if (email == '' || email == null) {
            return res.status(400).json({
                error: 'Email is required'
            });
        }

        if (!user.length > 0) {
            return res.status(404).json({
                error: 'User does not exist'
            });
        }

        if(password == '' || password == null) {
            return res.status(400).json({
                error: 'Password is required'
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                error: 'Email is invalid'
            });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                error: 'Password must be 8 characters or more and must include uppercase and lowercase letters, at least a number and a symbol'
            });
        }


        if (!await bcrypt.compare(password, user[0]['password'])) {
            res.status(400).json({
                error: 'Password is incorrect'
            });
        }

        const token = jwt.sign({email}, process.env.SECRET_KEY, {expiresIn: '10m'})

        return res.status(200).json({
            email,
            token
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

module.exports = {
    getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    login
}