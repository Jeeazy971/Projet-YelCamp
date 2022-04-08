/***** PACKAGES *****/
const express = require('express');
const router = express.Router();

/***** MODELS  *****/
const Campground = require('../models/campground.model');

/***** GESTIONNAIRE D'ERREURS  *****/
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

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
        campground.author = req.user._id;
        await campground.save();
        req.flash('success', "Création réussie d'un nouveau terrain de camping !");
        res.redirect(`/campgrounds/${campground._id}`);
    }),
);

/**** RECUPERATION D'UN CAMPING ****/
router.get(
    '/:id',
    catchAsync(async (req, res) => {
        const campgroundID = await Campground.findById(req.params.id)
            .populate('reviews')
            .populate('author');
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
    isAuthor,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campgroundID = await Campground.findById(id);
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
    isAuthor,
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
    isAuthor,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Camping supprimé avec succès !');
        res.redirect('/campgrounds');
    }),
);

module.exports = router;
