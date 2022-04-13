const express = require('express');
const passport = require('passport');
const router = express.Router();

/***** GESTIONNAIRE D'ERREURS  *****/
const users = require('../controllers/users.controllers');

/***** GESTIONNAIRE D'ERREURS  *****/
const catchAsync = require('../utils/catchAsync');

router.route('/register').get(users.renderRegister).post(catchAsync(users.createUser));

router
    .route('/login')
    .get(users.renderLogin)
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
        }),
        users.loginUser,
    );

router.get('/logout', users.logoutUser);

module.exports = router;
