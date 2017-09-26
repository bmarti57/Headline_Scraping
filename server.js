//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
//Scraping Tools
var request = require("request");
var cheerio = require("cheerio");

//Initialize Express
var app = express();

//Requiring Models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

mongoose.Promise = Promise;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

//Public Static Directory
app.use(express.static("public"));

//Config Database with mongoose
mongoose.connect("mongodb://heroku_5vttn84p:as8uf29ig6lmprqs973mshmtb2@ds141524.mlab.com:41524/heroku_5vttn84p");
var db = mongoose.connection;

//Require Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});
  
// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

//Require controller.js
var router = require("./controllers/controller.js");
app.use("/", router);

//Add Routes to GET and POST scraped article HERE
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("App is running on port " + port);
});