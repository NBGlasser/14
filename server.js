var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();

databaseURL = "articledb"
collections = ["articles"]

var db = mongojs(databaseURL, collections)
db.on("error", function (error) {
    console.log("Database Error:", error);
});

app.get("/", function (req, res) {
    res.render("index.html");
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.theonion.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        $(".content-wrapper").each(function (i, element) {
            var result = {}
            result.title = $(this).find(".content-meta__headline__wrapper").children().children().text()
            console.log(result)

        })
    })
});

app.listen(3000, function () {
    console.log("App running on port 3000!");
});