var express = require("express");
// var mongojs = require("mongojs");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });
mongoose.connect(MONGODB_URI);


var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();
app.use(logger("dev"));


databaseURL = "articledb"
collections = ["articles"]

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost/14-news", { useNewUrlParser: true });


// var db = mongojs(databaseURL, collections)
// db.on("error", function (error) {
//     console.log("Database Error:", error);
// });

app.get("/", function (req, res) {
    axios.get("https://www.theonion.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        $(".content-wrapper").each(function (i, element) {
            var result = {}
            result.title = $(this).find(".content-meta__headline__wrapper").children().children().text()
            result.link = $(this).find(".content-meta__headline__wrapper").children().children("a").attr("href")
            console.log(result)

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });

    })
    res.render("index.html");
    })
});

// app.get("/scrape", function (req, res) {
//     axios.get("https://www.theonion.com/").then(function (response) {
//         var $ = cheerio.load(response.data);
//         $(".content-wrapper").each(function (i, element) {
//             var result = {}
//             result.title = $(this).find(".content-meta__headline__wrapper").children().children().text()
//             result.link = $(this).find(".content-meta__headline__wrapper").children().children("a").attr("href")
//             console.log(result)

//             db.Article.create(result)
//                 .then(function (dbArticle) {
//                     console.log(dbArticle);
//                 })
//                 .catch(function (err) {
//                     console.log(err);
//                 });

//         })
//         res.send("Scrape Complete");
//     })
// });

app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(data){
      res.json(data)
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  
  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(data){
      console.log(data)
      res.json(data)
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  
  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

app.listen(PORT, function () {
    console.log("App running on port 3000!");
});