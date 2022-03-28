const mongoose = require('mongoose');
const Review = require('./review.model');
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
    image: String,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
});

campgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

module.exports = mongoose.model('Campground', campgroundSchema);
