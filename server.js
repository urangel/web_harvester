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

init();