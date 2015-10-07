var express = require("express");
var exphbs = require("express-handlebars");
var Waterline = require("waterline");
var bodyParser = require("body-parser");
var multer = require("multer");
var sailsDisk = require("sails-disk");
var app = express();

var orm = new Waterline();
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static(process.cwd() + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var config = {
	adapters: {
		"default": sailsDisk,
		disk: sailsDisk,
	},
	connections: {
		myLocalDisk: {
			adapter: "disk"
		}
	},
	defaults: {
		migrate: "alter"
	}
};

var Room = Waterline.Collection.extend({
	identity: "room",
	table: "room",
	connection: "myLocalDisk",
	attributes: {
		roomName: {
			type: "string",
			required: true,
			unique: true
		},
		users: {
			type: "array",
		}
	},

	beforeCreate: function(values, cb) {
		values.roomName = values.roomName.replace(/\s/, "+");
		cb();
	}
});

orm.loadCollection(Room);

app.get("/", function(req, res) {
	res.render("index");
});

app.get("/c/:room", function(req, res) {
	var roomName = req.params.room;

	app.models.room.findOneByRoomName(roomName, function(err, room) {	
		if (err) {
			return res.send("Sorry, there was an error\n", err);
		}

		if (!room) {
			return res.send("Chat room does not exist");
		}
		
		return res.render("chat", room);
	});
});

app.post("/create", function(req, res) {
	var roomName = req.body["room-name"];

	app.models.room.create({roomName: roomName, users: []}).exec(function(err, room) {
		if (err) {
			res.send("Sorry, there was an error\n", err);
		}

		res.redirect("/c/" + room.roomName);
	});
});

app.post("/roomupdate", function(req, res) {
	var roomName = req.body.roomname;
	var peerId = req.body.peerid;
	var updateType = req.body.updatetype;

	if (updateType === "add") {
		app.models.room.findOneByRoomName(roomName, function(err, room) {
			if (err) throw err;
		
			room.users.push(peerId);

			app.models.room.update({roomName: roomName}, {users: room.users}, function(err, room) {
				if (err) throw err;

				console.log(room[0].users);
				return res.send(room[0].users);
			});
		});
	} else if (updateType === "remove") {
		console.log("removing", peerId);
	}
});

module.exports = orm.initialize(config, function(err, models) {
	if (err) throw err;

	app.models = models.collections;
	app.connections = app.connections;

	app.listen(8080);
	console.log("Running");
});
