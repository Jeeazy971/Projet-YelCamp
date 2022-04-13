/***** MODELS  *****/
const Campground = require('../models/campground.model');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds: campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', "Création réussie d'un nouveau terrain de camping !");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const campgroundID = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            },
        })
        .populate('author');

    if (!campgroundID) {
        req.flash('error', 'Impossible de trouver ce camping');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campgroundID: campgroundID });
};

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campgroundID = await Campground.findById(id);
    if (!campgroundID) {
        req.flash('error', 'Impossible de trouver ce camping');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campgroundID: campgroundID });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    req.flash('success', 'Mise à jour réussie du terrain de camping !');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Camping supprimé avec succès !');
    res.redirect('/campgrounds');
};