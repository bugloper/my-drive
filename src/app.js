const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());

// ROOT index.html
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Controllers
const authController = require('./controllers/api/v1/auths.controller');
app.use('', authController);

const currentUser = require('./middlewares/current.user');
app.use(currentUser);

const folderController = require('./controllers/api/v1/folders.controller');
app.use('', folderController);

const rootController = require('./controllers/api/v1/roots.controller');
app.use('', rootController);

const fileController = require('./controllers/api/v1/files.controller');
app.use('', fileController);

module.exports = app;
