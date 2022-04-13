/***** PACKAGES *****/
const express = require('express');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

/**
 * mergeParams permet d'accéder a l'ID (:id)
 * de ma route ceci dessous dans la partie app.js à la ligne 65
 * app.use('/campgrounds/:id/reviews', reviewsRoutes);
 **/
const router = express.Router({ mergeParams: true });

/***** CONTROLLERS  *****/
const reviews = require('../controllers/reviews.controllers');

/***** GESTIONNAIRE D'ERREURS  *****/
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

/**** CREATION D'UN COMMENTAIRE ****/
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

/**** SUPPRESSION D'UN COMMENTAIRE ****/
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
