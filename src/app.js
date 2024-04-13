const express = require("express"); //Import express module
const app = express();  //create a new express app.

const bodyParser = require("body-parser");
const currentUser = require('./middlewares/current.user');
const demo = require('./middlewares/demo');
const redisClient = require('./utils/redis.client');
const cookieParser = require("cookie-parser");


const port = 4000;

// Middlewares 
app.use(bodyParser.json());
app.use(demo);
app.use(cookieParser()); 

// ROOT index.html
const path = require("path"); //Import path module which is used to join paths
app.get("/", (_req, res) => { //Route handler for the root path.
  res.sendFile(               //sends index.html as the response using sendFile() method.
    path.join(__dirname, "public", "index.html")
  )
});

// Controllers
const authController = require('./controllers/api/v1/auths.controller');
app.use('', authController);

app.use(currentUser); //Middleware

const folderController = require('./controllers/api/v1/folders.controller');
app.use('', folderController);

const rootController = require('./controllers/api/v1/roots.controller');
app.use('', rootController);

const fileController = require('./controllers/api/v1/files.controller');
app.use('', fileController);

app.listen(port, () => {
  console.log(`App is listening on: http://localhost:${port}`);
})

process.on('SIGINT', () => {
  redisClient.quit();
  process.exit();
});
