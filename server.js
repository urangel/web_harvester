// const mongojs = require("mongojs");
// const db = mongojs("web_harvester_db", ["site"]);
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
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
    res.render("index", {w: "whatever"});
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

                db.Article.create(obj)
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
        res.render("index", {key: objArr});

    });
});



const data = [];

async function init() {
    try{
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36"
        );
        await page.goto("https://pubs.acs.org/action/showMostReadArticles?journalCode=jacsat");
        await page.waitForSelector(".art_title.linkable");
        const articles = await page.$$(".articleBox");
        for (let i = 0; i<articles.length; i++){
            const eachObj = {}
            const article = articles[i];
            
            const titleDiv = await article.$("a");
            const title = await page.evaluate(function(focused){
                return focused.innerText;
            }, titleDiv);
            eachObj.title = title;

            const doiDiv = await article.$(".DOI");
            const doi = await page.evaluate(function (focused){
                return focused.innerText;    
            }, doiDiv);
            eachObj.doi = doi;
            
            const dateDiv = await article.$(".epubdate");
            const date = await page.evaluate(function (focused){
                return focused.innerText;    
            }, dateDiv);
            eachObj.date = date.slice(24);

            const authorDiv = await article.$(".articleEntryAuthor.full");
            const authors = await authorDiv.$$(".entryAuthor.normal.hlFld-ContribAuthor");

            let authorsArr = [];

            for (let j = 0; j<authors.length; j++){

                const author = authors[j];
                const authorName = await page.evaluate(function(author){
                    return author.innerText;
                }, author);
                authorsArr.push(authorName);
            }
            eachObj.authors = authorsArr;
            data.push(eachObj);
        }
        console.log(data);
    }
    catch(e){
        console.log("Error: ", e);
    }
}

// init();