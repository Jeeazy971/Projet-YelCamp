const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const app = express();

/***** GESTIONNAIRE D'ERREURS  *****/
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

/***** VALIDATION SCHEMAS  *****/
const { campgroundSchema, reviewSchema } = require('./schemas');

/***** MODELS  *****/
const Campground = require('./models/yelpcamp.model');
const Review = require('./models/review.model');

/**** MIDDLEWARES ****/
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// GESTION D'ERREUR DANS LES INPUTS VIA LE MODULE JOI

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

/***** ROUTES *****/

app.get('/', (req, res) => {
    res.render('home');
});

app.get(
    '/campgrounds',
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds: campgrounds });
    }),
);

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post(
    '/campgrounds',
    validateCampground,
    catchAsync(async (req, res) => {
        // if (!req.body.campground) {
        //     throw new ExpressError('Données du camping invalide ou incomplète', 400);
        // }

        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    }),
);

app.put(
    '/campgrounds/:id',
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {
            ...req.body.campground,
        });
        res.redirect(`/campgrounds/${campground._id}`);
    }),
);

app.get(
    '/campgrounds/:id/edit',
    catchAsync(async (req, res) => {
        const campgroundID = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campgroundID: campgroundID });
    }),
);

app.get(
    '/campgrounds/:id',
    catchAsync(async (req, res) => {
        const campgroundID = await Campground.findById(req.params.id).populate('reviews');
        res.render('campgrounds/show', { campgroundID: campgroundID });
    }),
);

app.delete(
    '/campgrounds/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds');
    }),
);

app.post(
    '/campgrounds/:id/reviews',
    validateReview,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    }),
);

app.delete(
    '/campgrounds/:id/reviews/:reviewId',
    catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findById(reviewId);

        res.redirect(`/campgrounds/${id}`);
    }),
);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page non trouvé', 404));
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Quelque chose s'est mal passé !";
    res.status(status).render('error', { err: err });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le PORT:${PORT}`);
});
