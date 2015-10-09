$(function () {
  $('[data-toggle="popover"]').popover();

	var peerId = prompt("Enter an ID");
	var peer = new Peer(peerId, {key: "vpzfzavxowjc3di"});
	var myFeed;

	navigator.getUserMedia = navigator.getUserMedia ||
														navigator.webkitGetUserMedia ||
														navigator.mozGetUserMedia ||
														navigator.msGetUserMedia;

	navigator.getUserMedia({audio: false, video: true},
		function(stream) {
			var video = document.querySelector("#my-cam");
			myFeed = stream;
			video.src = URL.createObjectURL(stream);
			video.onloadedmetadata = function(e) {
				video.play();
			};
		}, function(err) {
			console.log("Error", err);
		}
	);


	$("#call").click(function() {
		// this is for the caller
		var connectPeer = prompt("Enter ID to connect to");
		var call = peer.call(connectPeer, myFeed);
		var dataConn = peer.connect(connectPeer);
		displayCall(call);
		canHangup(call);

		dataConn.on("data", function(data) {
			console.log(data);
		});

		$("#textchat").click(function() {
			dataConn.send("Hello world");
		});
	});

	peer.on("call", function(call) {
		// this is for the called
		console.log("Getting a call");
		call.answer(myFeed);
		displayCall(call);
		canHangup(call);
		peer.on("connection", function(dataConn) {
			dataConn.on("data", function(data) {
				console.log(data);
			});

			$("#textchat").click(function() {
				dataConn.send("Hey Buddy");
			});
		});
	});

	function displayCall(call) {
		call.on("stream", function(stream) {
			var callCam = document.querySelector("#call-cam");
			callCam.src = URL.createObjectURL(stream);
			callCam.onloadedmetadata = function(e) {
				callCam.play();
			};
		});
	}

	function canHangup(call) {
		$("#hangup").click(function() {
			call.close();
		});
	}

	function sendMessage(dataConn, msg) {
		dataConn.send(msg);
	}

	peer.on("error", function(err) {
		if (err.type === "unavailable-id") {
			peerId = prompt("ID being used, try again");
			peer = new Peer(peerId, {key: "vpzfzavxowjc3di"});
		}
	});

})
