const knex = require('../../db/knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [userId] = await knex('users').insert({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ id: userId, name, email });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user.', error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        const user = await knex('users').where({ email }).first();
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.', error });
    }
};