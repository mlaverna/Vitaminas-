const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const fs = require('fs');
const request = require('request');

const visual_recognition = new VisualRecognitionV3({
    api_key: 'f69e90e326b2c5cd0078513abe62864ee5a38d51',
    version_date: '2016-05-20'
});

const classifyVr = (photoUrl) => {
    return new Promise((resolve, reject) => {
        download(photoUrl, 'telegram.jpg').then(() => {
            var params = {
                images_file: fs.createReadStream(__dirname + 'telegram.jpg')
            };
            visual_recognition.classify(params, function (err, res) {
                if (err)
                    reject(err)
                else
                    resolve(res); 
            });
        });
    });
};

const download = function (uri, filename) {
    return new Promise((resolve, reject) => {
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(__dirname + filename)).on('close', () => resolve());
        });
    });
};

module.exports = { classifyVr };
