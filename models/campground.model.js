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

const imageSchema = new Schema({
    url: String,
    filename: String,
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new Schema({
    title: String,
    price: String,
    images: [imageSchema],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
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
