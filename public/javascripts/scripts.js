$(function () {
  $('[data-toggle="popover"]').popover();

	var peer = new Peer({key: "vpzfzavxowjc3di"});
	var roomName = window.location.href.split("/")[4];
	var conn = [];

	peer.on("open", function(id) {
		console.log("My peer ID is:", id);

		$.post("/roomupdate", {roomname: roomName, peerid: id, updatetype: "add"}, function(data) {
			for (var i = 0; i < data.length; i++) {
				conn.push(peer.connect(data[i]));

				conn[i].on("error", function(err) {
					console.log("err");
				});
			}
		});
	});

})
