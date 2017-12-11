const Cloudant = require('cloudant');

const cloudant = Cloudant({
    account: 'fdbbf5b1-2bd5-4570-b1ff-5e9ecb5fdc39-bluemix.cloudant.com',
    password: '5c0ea7dec207b59f14c8da87286beccad7bad9248c5742709e3e4d7c5e7e6309'
});

const useDb = cloudant.db.use('fruits');

const listFruits = function (callback) {
    return new Promise((resolve, reject) => {
        useDb.list({
            include_docs: true
        }, function (err, fruits) {
            if (err) reject(err);

            resolve(fruits);
        })
    });
};

module.exports = { listFruits };