//web scraping goes in here
var express = require("express");
var path = require("path");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

router.get('/', function (req, res){
    
          res.render("index");
      });
   

router.get("/scrape", function(req, res) {
    request("https://www.nytimes.com/", function(error, response, html) {
        var $ = cheerio.load(html);
        $("h2.story-heading").each(function(i, element) {
            var results = {};

            results.title = $(this).children("a").text();
            results.link = $(this).children("a").attr("href");
            results.summary = $(this).children("p").attr("summary");

            var entry = new Article(results);
            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                } 
            }); //entry.save
        }); //$("h2.story-heading")
    }); //request
    res.send("Scrape Complete");
}); //app.get

// GET the scraped articles from mongoDB
router.get("/articles", function(req, res) {
    Article.find({}, function(error, doc) {
        if(error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

router.get("/articles/:id", function(req, res) {
    Article.findOne({ "_id": req.params.id })
    .populate("note")
    .exec(function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

// Create or replace a note
router.post("/articles/:id", function(req, res) {
    var newNote = new Note(req.body);

    newNote.save(function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            Article.findOneAndUpdate({ "_id": req.params.id }, {"note": doc._id})
            .exec(function(err, doc) {
                if(err) {
                    console.log(err);
                } else {
                    res.send(doc);
                }
            });
        }
    });
});

module.exports = router;