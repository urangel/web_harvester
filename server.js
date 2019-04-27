const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require ("mongoose");
const handlebars = require("express-handlebars");


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper_db";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

const db = require("./app/models");

const app = express();

app.engine("handlebars", handlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(express.static("app/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("On port: " + PORT);
});

app.get("/", function(req, res){
    db.Article.find({})
    .then(function(dbArticles){
        res.render("index", {key: dbArticles});
    });
});

app.get("/scrape", function(req, res){
    const objArr = [];
    axios.get("https://www.npr.org/").then(function(response){
        const $ = cheerio.load(response.data);
    
        $(".story-text").each(function(i, div) {
            const obj = {};
    
            obj.title = $(this).find(".title").text();
            obj.url = $(this).find(".title").parent().attr("href");
            obj.teaser = $(this).find(".teaser").text();
            
            if(!obj.title || !obj.url || !obj.teaser){
                console.log("not valid");
            }
            else {

                // db.Article.find({}).then(function(dbArticles){
                //     for(let i =0; i < dbArticles.length; i++){
                //         if (obj.title === dbArticles[i].title)
                //     }
                // })

                db.Article.update(obj)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });

                objArr.push(obj);
            }
        });
        // console.table(objArr);
        db.Article.find({}).then(function(dbArticles){
            res.render("index", {key: dbArticles});
        })
    });
});

app.get("/readNote/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        console.log(dbArticle);
        res.json(dbArticle);
      })
      .catch(function(err) {
        console.log(err);
      });
  });
  

app.post("/saveNote/:id", function(req, res){
    console.log(req.body);
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(){
        console.log("note saved");
    })
    .catch(function(err) {
        console.log(err);
    });
});

app.delete("/deleteNote/:id", function(req, res){
    console.log(`ObjectId("${req.params.id}")`);
    db.Note.findOneAndDelete({_id: req.params.id})
    .then(function(){
        res.send("deleted");
    })
    .catch(function(err){
        console.log(err);
    });
});