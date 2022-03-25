const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose
    .connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Connexion à la BDD réussie');
    })
    .catch((err) => {
        console.log('Connexion impossible à la BDD');
        console.log(err);
    });

const campgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
});

module.exports = mongoose.model('Campground', campgroundSchema);
