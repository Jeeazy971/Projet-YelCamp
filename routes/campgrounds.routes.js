/***** PACKAGES *****/
const express = require('express');
const router = express.Router();
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });

/***** CONTROLLERS  *****/
const campgrounds = require('../controllers/campgrounds.controllers');

/***** GESTIONNAIRE D'ERREURS  *****/
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router
    .route('/')
    /**** RECUPERATION DES CAMPINGS ****/
    .get(catchAsync(campgrounds.index))
    /**** CREATION DU CAMPING ****/
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send('fonctionne');
    });

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router
    .route('/:id')
    /**** RECUPERATION D'UN CAMPING ****/
    .get(catchAsync(campgrounds.showCampground))
    /**** MAJ DU CAMPING ****/
    .put(
        isLoggedIn,
        isAuthor,
        validateCampground,
        catchAsync(campgrounds.updateCampground),
    )
    /**** SUPPRESSION DU CAMPING ****/
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground));

module.exports = router;
