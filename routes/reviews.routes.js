/***** PACKAGES *****/
const express = require('express');
const { validateReview, isLoggedIn } = require('../middleware');

/**
 * mergeParams permet d'accéder a l'ID (:id)
 * de ma route ceci dessous dans la partie app.js à la ligne 65
 * app.use('/campgrounds/:id/reviews', reviewsRoutes);
 **/
const router = express.Router({ mergeParams: true });

/***** MODELS  *****/
const Campground = require('../models/campground.model');
const Review = require('../models/review.model');

/***** GESTIONNAIRE D'ERREURS  *****/
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

/**** CREATION D'UN COMMENTAIRE ****/
router.post(
    '/',
    isLoggedIn,
    validateReview,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success', 'Nouvelle revue créée !');
        res.redirect(`/campgrounds/${campground._id}`);
    }),
);

/**** SUPPRESSION D'UN COMMENTAIRE ****/
router.delete(
    '/:reviewId',
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findById(reviewId);
        req.flash('success', 'Avis supprimé avec succès !');
        res.redirect(`/campgrounds/${id}`);
    }),
);

module.exports = router;
