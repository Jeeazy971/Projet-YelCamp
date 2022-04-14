/***** MODELS  *****/
const Campground = require('../models/campground.model');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds: campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
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
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    // Suppression d'images
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    req.flash('success', 'Mise à jour réussie du terrain de camping !');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Camping supprimé avec succès !');
    res.redirect('/campgrounds');
};
