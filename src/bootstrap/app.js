const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session)
const flash = require("req-flash")

const shareSessison = session({
    secret: "project-secret",
    store: new MongoStore({
        url: "mongodb://localhost:27017/project_db_session"
    })
})

app.use(shareSessison)
app.use(flash({ locals: 'flash' }))


require("../libs/mongo-db");

app.use(require("../apps/middlewares/shareData"))

app.use("/assets", express.static(path.join(__dirname, "..", "public")));

//Using body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Using template engine
app.set("views", path.join(__dirname, "..", "apps", "views"));
app.set("view engine", "ejs");

// app.use("/api", require("../routers/api"));
app.use("/", require("../routers/web"));

app.session = shareSessison
module.exports = app;
