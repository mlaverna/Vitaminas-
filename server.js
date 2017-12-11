'use strict'

const app = require('express')();
const orchestrator = require('./server/orchestrator');
require('dotenv').config({ silent: true });

const port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

orchestrator.listenTelegram();

// Start Server
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});