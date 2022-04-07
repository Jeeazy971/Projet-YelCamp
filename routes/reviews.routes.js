/***** PACKAGES *****/
const express = require('express');

/**
 * mergeParams permet d'accéder a l'ID (:id)
 * de ma route ceci dessous dans la partie app.js à la ligne 52
 * app.use('/campgrounds/:id/reviews', reviewsRoutes);
 **/
const router = express.Router({ mergeParams: true });

/***** MODELS  *****/
const Campground = require('../models/yelpcamp.model');
const Review = require('../models/review.model');

/***** GESTIONNAIRE D'ERREURS  *****/
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

/***** VALIDATION SCHEMAS  *****/
const { reviewSchema } = require('../schemas');

/**** GESTION DES ERREURS DANS LES INPUTS VIA LE MODULE JOI ****/
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

/**** CREATION D'UN COMMENTAIRE ****/
router.post(
    '/',
    validateReview,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
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
    catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findById(reviewId);
        req.flash('success', 'Avis supprimé avec succès !');
        res.redirect(`/campgrounds/${id}`);
    }),
);

module.exports = router;
