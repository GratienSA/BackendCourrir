const { User } = require('../Model/User');
const client = require('../Services/DbConnexion');
const bcrypt = require('bcrypt');
const { ObjectId } = require('bson');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');

const register = async (request, response) => {
    if (
        !request.body.firstName ||
        !request.body.lastName ||
        !request.body.email ||
        !request.body.password
    ) {
        response.status(400).json({ error: 'Some fields are missing' });
        return;
    }

    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    try {
        let user = new User(
            request.body.firstName,
            request.body.lastName,
            'user',
            request.body.email,
            hashedPassword,
            new Date(),
            new Date(),
            true
        );

        let result = await client
            .db('courrir')
            .collection('user')
            .insertOne(user);
        response.status(200).json(result);
    } catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
};

const login = async (request, response) => {
    if (!request.body.email || !request.body.password) {
        response.status(400).json({ error: 'Some fields are missing' });
        return;
    }

    let user = await client
        .db('courrir')
        .collection('user')
        .findOne({ email: request.body.email });

    if (!user) {
        response.status(401).json({ error: 'Wrong credentials' });
        return;
    }

    const isValidPassword = await bcrypt.compare(
        request.body.password,
        user.password
    );

    if (!isValidPassword) {
        response.status(401).json({ error: 'Wrong credentials' });
    } else {
        const generateSecretKey = () => {
            const randomString = crypto.randomBytes(64).toString('hex');
            const hashedKey = bcrypt.hashSync(randomString, 10);
            return hashedKey;
        };

        const newSecretKey = generateSecretKey();

        const token = jwt.sign(
            {
                email: user.email,
                id: user._id,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                gdpr: new Date(user.gdpr).toLocaleString('fr'),
            },
            process.env.MY_SUPER_SECRET_KEY,
            { expiresIn: '365d' }
        );

        response.status(200).json({ jwt: token });
    }
};

const getUserProfile = async (request, response) => {
    const userId = request.user.id;

    try {
        const user = await client
            .db('courrir')
            .collection('user')
            .findOne({ _id: ObjectId(userId) });

        if (!user) {
            response.status(404).json({ error: 'User not found' });
            return;
        }

        response.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            gdpr: new Date(user.gdpr).toLocaleString('fr'),
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
};

const updateUserProfile = async (request, response) => {
    const userId = request.user.id;
    const { firstName, lastName, email } = request.body;

    try {
        const result = await client
            .db('courrir')
            .collection('user')
            .updateOne(
                { _id: ObjectId(userId) },
                { $set: { firstName, lastName, email } }
            );

        if (result.modifiedCount === 1) {
            return response.status(200).json({ message: 'User profile updated successfully' });
        } else {
            return response.status(404).json({ error: 'User not found or profile update failed' });
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        return response.status(500).json({ error: "Internal Server Error" });
    }
};

const logoutUser = async (request, response) => {
    try {
        return response.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error("Error logging out user:", error);
        return response.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteUserAccount = async (request, response) => {
    const userId = request.user.id;

    try {
        const result = await client
            .db('courrir')
            .collection('user')
            .deleteOne({ _id: ObjectId(userId) });

        if (result.deletedCount === 1) {
            return response.status(200).json({ message: 'User account deleted successfully' });
        } else {
            return response.status(404).json({ error: 'User not found or account deletion failed' });
        }
    } catch (error) {
        console.error("Error deleting user account:", error);
        return response.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { register, login, getUserProfile,updateUserProfile,logoutUser,deleteUserAccount }; 
