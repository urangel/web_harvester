const mongojs = require("mongojs");
const db = mongojs("web_harvester_db", ["site"]);
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("L. on port: " + PORT);
});