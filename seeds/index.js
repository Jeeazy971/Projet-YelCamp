const mongoose = require('mongoose');
const Campground = require('../models/campground.model');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const sample = (array) => array[Math.trunc(Math.random() * array.length)];

async function seedDB() {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.trunc(Math.random() * 1000);
        const price = Math.trunc(Math.random() * 20) + 10;
        const camp = new Campground({
            // L'ID de l'utilisateur
            author: '624ed8908afe85a2e01ed2c3',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                'Lorem ipsum dolor sit amet. Aut impedit Quis qui asperiores quae est enim distinctio sit quis cupiditate eum exercitationem nisi et quasi itaque? Id nobis nihil ab quidem inventore et libero illo.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude],
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dqr1seyu2/image/upload/v1649950806/YelpCamp/xeyxzvnazd6xhi7dowuc.jpg',
                    filename: 'YelpCamp/xeyxzvnazd6xhi7dowuc',
                },
                {
                    url: 'https://res.cloudinary.com/dqr1seyu2/image/upload/v1649954600/YelpCamp/toc468gbqhvaevfw0ix1.jpg',
                    filename: 'YelpCamp/toc468gbqhvaevfw0ix1',
                },
            ],
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

// https://source.unsplash.com/user/wood
