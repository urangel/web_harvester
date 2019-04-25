const mongojs = require("mongojs");
const db = mongojs("web_harvester_db", ["site"]);
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

// const app = express();

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, function(){
//     console.log("L. on port: " + PORT);
// });

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
            const article = articles[i];
            const titleDiv = await article.$("a");
            const title = await page.evaluate(function(article){
                return article.innerText;
            }, titleDiv);
            console.log(title);
        }

    }
    catch(e){
        console.log("Error: ", e);
    }
}

init();