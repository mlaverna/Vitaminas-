'use strict'

const TelegramBot = require('node-telegram-bot-api');
const visual_recognition = require('./watson/vr');
const cloudant = require('./db/cloudant');
const token = '433176007:AAE_7LxvNK5Yq2Ec1fN0K6XUa7qPZGNulSw';
const telegramBot = new TelegramBot(token, { polling: true });
const fs = require('fs');

const listenTelegram = () => {
    telegramBot.on('message', (msg) => {
        var classifiers;
        if (msg['photo']) {
            var chatId = msg.chat.id;
            telegramBot.getFileLink(msg.photo[2].file_id).then((photoUrl) => {
                visual_recognition.classifyVr(photoUrl).then((res) => {
                    fs.unlink(__dirname + `/${res.images[0].image}`);

                    classifiers = res.images[0].classifiers[0].classes;
                    for (let i = 0; classifiers.length > i; i++) {
                        if (classifiers[i].class === "fruit") {
                            return cloudant.listFruits();
                        } else if (classifiers.length - 1 === i) {
                            telegramBot.sendMessage(chatId, "A imagem enviada não é uma fruta.");
                        }
                    }
                }).then((res) => {
                    var fruits = res.rows;
                    loop1:
                    for (var i = 0; i < classifiers.length; i++) {
                        loop2:
                        for (var j = 0; j < fruits.length; j++) {
                            if (classifiers[i].class === fruits[j].doc.name) {
                                telegramBot.sendMessage(chatId, fruits[j].doc.text);
                                break loop1;
                            }
                        }
                        if (i === classifiers.length - 1) {
                            telegramBot.sendMessage(chatId, "Não encontrei esta fruita no banco de dados.");
                        }
                    }
                }).catch((errorMessage) => {
                    console.log(`errorMessage: ${errorMessage}`);
                });
            });
        }
    });
};

module.exports = { listenTelegram }