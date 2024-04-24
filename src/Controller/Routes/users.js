const express = require('express');
const { register, login, getUserProfile, updateUserProfile,logoutUser,deleteUserAccount} = require('../UserController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getUserProfile);
router.put('/profile/update',updateUserProfile);
router.post('/logout', logoutUser);
router.delete('/profile/delete', deleteUserAccount);

module.exports = router;
