if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

/***** PACKAGES *****/
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const app = express();

/***** MODEL *****/
const User = require('./models/user.model');

/***** GESTIONNAIRE D'ERREURS *****/
const ExpressError = require('./utils/ExpressError');

/**** ROUTES ****/
const campgroundsRoutes = require('./routes/campgrounds.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const userRoutes = require('./routes/users.routes');

/**** MIDDLEWARES ****/
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

/**** SESSION ****/
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));
app.use(flash());

/**** PASSEPORT ****/
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

/**** ROUTES PATH ****/
app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page non trouvé', 404));
});

/**** ERREUR ROUTES ****/
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Quelque chose s'est mal passé !";
    res.status(status).render('error', { err: err });
});

/**** PORT D'ÉCOUTES ****/
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le PORT:${PORT}`);
});
