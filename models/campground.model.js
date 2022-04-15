const mongoose = require('mongoose');
const Review = require('./review.model');
const MongoDBStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';


const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret,
    },
});

store.on('error', function (err) {
    console.log('ERREUR SESSION STORE', err);
});

const Schema = mongoose.Schema;
mongoose
    .connect(dbUrl)
    .then(() => {
        console.log('Connexion à la BDD réussie');
    })
    .catch((err) => {
        console.log('Connexion impossible à la BDD');
        console.log(err);
    });

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

const opts = {
    toJSON: {
        virtuals: true,
    },
};

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema(
    {
        title: String,
        price: String,
        images: [ImageSchema],
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
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
    },
    opts,
);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href='/campgrounds/${
        this._id
    }'>${this.title}</a></strong><p>${this.description.substring(0, 20)}...</p>`;
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
