var express = require("express");
var exphbs = require("express-handlebars");
var app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
	res.render("chat")
});

var server = app.listen(8080, function() {
	console.log("WebgeekRTC running");
});
