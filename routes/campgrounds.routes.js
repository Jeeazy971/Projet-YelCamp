/***** PACKAGES *****/
const express = require('express');
const router = express.Router();

/***** MODELS  *****/
const Campground = require('../models/yelpcamp.model');

/***** GESTION D'ERREUR DANS LES INPUTS VIA LE MODULE JOI *****/
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

const isLoggedIn = require('../middleware');

/***** VALIDATION SCHEMAS  *****/
const { campgroundSchema } = require('../schemas');

/***** GESTIONNAIRE D'ERREURS  *****/
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

/**** RECUPERATION DES CAMPINGS ****/
router.get(
    '/',
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds: campgrounds });
    }),
);

/**** CREATION DU CAMPING ****/
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post(
    '/',
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash('success', "Création réussie d'un nouveau terrain de camping !");
        res.redirect(`/campgrounds/${campground._id}`);
    }),
);

/**** RECUPERATION D'UN CAMPING ****/
router.get(
    '/:id',
    catchAsync(async (req, res) => {
        const campgroundID = await Campground.findById(req.params.id).populate('reviews');
        if (!campgroundID) {
            req.flash('error', 'Impossible de trouver ce camping');
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campgroundID: campgroundID });
    }),
);

/**** MODIFICATION DU CAMPING ****/
router.get(
    '/:id/edit',
    isLoggedIn,
    catchAsync(async (req, res) => {
        const campgroundID = await Campground.findById(req.params.id);
        if (!campgroundID) {
            req.flash('error', 'Impossible de trouver ce camping');
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', { campgroundID: campgroundID });
    }),
);

router.put(
    '/:id',
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {
            ...req.body.campground,
        });
        req.flash('success', 'Mise à jour réussie du terrain de camping !');
        res.redirect(`/campgrounds/${campground._id}`);
    }),
);

/**** SUPPRESSION DU CAMPING ****/
router.delete(
    '/:id',
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Camping supprimé avec succès !');
        res.redirect('/campgrounds');
    }),
);

module.exports = router;
